import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as mammoth from 'mammoth';
import { DatasetService } from '../dataset/dataset.service'; 

@Injectable()
export class AiService implements OnModuleInit {
  private readonly apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  private readonly apiKey: string;
  private readonly assistantFilePath: string;
  private assistantContent: string; 
  private foodData: string; 

  constructor(
    private readonly configService: ConfigService,
    private readonly datasetService: DatasetService, 
  ) {
    this.apiKey = this.configService.get<string>('GROQ_API_KEY');
    this.assistantFilePath = path.resolve(__dirname, '../../specialist_prompt.docx'); 
  }

  async onModuleInit() {
    
    this.assistantContent = await this.loadAssistantContent();

    
    const dataset = this.datasetService.getDataset();
    this.foodData = dataset
      .filter((record) => record['Index Glycemic'] < 55) 
      .slice(0, 50) 
      .map((record) => {
        const food = record['Food'];
        const glycemicIndex = record['Index Glycemic'];
        const calories = record['Calories'];
        const protein = record['Protein'];
        const fat = record['Fat'];
        const carbs = record['Carbohydrates'];

        return `${food} -> GI: ${glycemicIndex}, Calories: ${calories}, Protein: ${protein}, Fat: ${fat}, Carbs: ${carbs}`;
      })
      .join('\n');
  }

  private async loadAssistantContent(): Promise<string> {
    try {
      const fileBuffer = fs.readFileSync(this.assistantFilePath);
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return result.value.trim();
    } catch (error) {
      console.error('Error reading .docx file:', error);
      throw new Error('Unable to read the assistant configuration file.');
    }
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const fullPromptAgent = `
        ${this.assistantContent}

        YOU MUST GIVE SHORT ANSWERS, DO NOT LEAVE SPACES, DO NOT GO ON MULTIPLE LINES AND DO NOT MAKE LISTS. THEY MUST BE COMPACT MESSAGES!!!

        DATASET:
        ${this.foodData}
      `;
  
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
  model: 'llama-3.3-70b-versatile',  
  messages: [
    { role: 'system', content: fullPromptAgent.trim() }, 
    { role: 'user', content: prompt },
  ],
}),
      });
  
      
      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Derailed API tram:', {
          status: response.status,
          statusText: response.statusText,
          body: errorBody,
        });
        throw new Error(`Error API: ${response.statusText}`);
      }
  
      const data = await response.json();
      
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling the API:', error.message);
    }
  }  
}
