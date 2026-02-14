
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ProductData, Proposal, GenerationConfig } from "../types";
import { INTERNAL_SYSTEM_PROMPT } from "../constants";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Helper to extract base64 data and mime type from a data URL
 */
const parseDataUrl = (dataUrl: string) => {
  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) return { mimeType: 'image/png', data: dataUrl };
  return { mimeType: matches[1], data: matches[2] };
};

export const generateProposals = async (data: ProductData): Promise<Proposal[]> => {
  const ai = getAI();
  const prompt = `
    請根據以下產品資料與需求，產出三個不同的海報設計提案。
    產品名稱: ${data.name}
    產品描述: ${data.details}
    選定風格: ${data.styles.join(", ")}
    強制約束: ${data.constraints.join(", ")}
    
    請以 JSON 陣列格式回傳，每個提案包含：
    - id: 字串
    - title: 提案標題
    - description: 視覺設計描述 (繁體中文)
    - copyTitle: 推薦主標
    - copySubtitle: 推薦副標
    - copyBody: 推薦短文案
    - visualDirection: 給圖像生成模型的關鍵方向描述
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: INTERNAL_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            copyTitle: { type: Type.STRING },
            copySubtitle: { type: Type.STRING },
            copyBody: { type: Type.STRING },
            visualDirection: { type: Type.STRING },
          },
          required: ["id", "title", "description", "copyTitle", "copySubtitle", "copyBody", "visualDirection"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};

export const generatePosterImage = async (
  promptText: string,
  config: GenerationConfig,
  productImages: string[]
): Promise<string> => {
  const ai = getAI();
  
  // Use product images as part of the context to maintain consistency
  const parts: any[] = productImages.slice(0, 3).map(img => {
    const { mimeType, data } = parseDataUrl(img);
    return {
      inlineData: { data, mimeType }
    };
  });
  
  parts.push({ text: `基於這些產品原圖，生成一張符合以下描述的海報，絕對嚴格遵守產品原圖中的外觀、材質、細節：\n${promptText}` });

  // imageSize is only supported for gemini-3-pro-image-preview. 
  // Omit it for other models (like gemini-2.5-flash-image) to avoid 400 errors.
  const imageConfig: any = {
    aspectRatio: config.aspectRatio,
  };

  if (config.model === 'gemini-3-pro-image-preview') {
    imageConfig.imageSize = config.imageSize;
  }

  const response = await ai.models.generateContent({
    model: config.model,
    contents: { parts },
    config: {
      imageConfig: imageConfig
    }
  });

  let imageUrl = "";
  let textExplanation = "";

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      break;
    } else if (part.text) {
      textExplanation += part.text;
    }
  }
  
  if (!imageUrl) {
    throw new Error(textExplanation || "生成失敗：模型未返回圖像。這可能是因為內容觸發了安全過濾器或指令過於複雜。");
  }
  return imageUrl;
};

export const editPosterImage = async (
  baseImage: string,
  editPrompt: string
): Promise<string> => {
  const ai = getAI();
  const { mimeType, data } = parseDataUrl(baseImage);
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data, mimeType } },
        { text: `請修改這張圖片：${editPrompt}。保持產品本身外觀不變，僅調整背景、光影或局部氛圍。` }
      ]
    }
  });

  let textExplanation = "";
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    } else if (part.text) {
      textExplanation += part.text;
    }
  }
  throw new Error(textExplanation || "修改失敗：模型未返回圖像。");
};

export const analyzeImage = async (imageUrl: string): Promise<string> => {
  const ai = getAI();
  const { mimeType, data } = parseDataUrl(imageUrl);
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data, mimeType } },
        { text: "請以專業行銷與視覺設計師的角度，用繁體中文分析這張海報。分析內容包含：產品還原度、構圖美學、文案與視覺的契合度，以及針對目標客群（如：長青族、兒童）的吸引力評分。" }
      ]
    }
  });
  return response.text || "無法獲取分析結果。";
};
