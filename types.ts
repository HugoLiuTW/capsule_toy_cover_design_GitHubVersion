
export enum AppStep {
  INPUT = 0,
  PROPOSAL = 1,
  FINAL = 2
}

export interface ProductData {
  name: string;
  details: string;
  productImages: string[]; // Base64 strings
  referenceImages: string[]; // Base64 strings
  referenceDesc: string;
  useRef: boolean;
  styles: string[];
  constraints: string[];
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  copyTitle: string;
  copySubtitle: string;
  copyBody: string;
  visualDirection: string;
}

export interface GenerationConfig {
  aspectRatio: string;
  imageSize: string;
  model: 'gemini-2.5-flash-image' | 'gemini-3-pro-image-preview';
}
