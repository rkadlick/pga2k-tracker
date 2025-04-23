import { IconType } from 'react-icons';
import {
  TbCircleLetterAFilled, TbCircleLetterBFilled, TbCircleLetterCFilled, TbCircleLetterDFilled, TbCircleLetterEFilled,
  TbCircleLetterFFilled, TbCircleLetterGFilled, TbCircleLetterHFilled, TbCircleLetterIFilled, TbCircleLetterJFilled,
  TbCircleLetterKFilled, TbCircleLetterLFilled, TbCircleLetterMFilled, TbCircleLetterNFilled, TbCircleLetterOFilled,
  TbCircleLetterPFilled, TbCircleLetterQFilled, TbCircleLetterRFilled, TbCircleLetterSFilled, TbCircleLetterTFilled,
  TbCircleLetterUFilled, TbCircleLetterVFilled, TbCircleLetterWFilled, TbCircleLetterXFilled, TbCircleLetterYFilled,
  TbCircleLetterZFilled,
  TbCircleLetterA, TbCircleLetterB, TbCircleLetterC, TbCircleLetterD, TbCircleLetterE,
  TbCircleLetterF, TbCircleLetterG, TbCircleLetterH, TbCircleLetterI, TbCircleLetterJ,
  TbCircleLetterK, TbCircleLetterL, TbCircleLetterM, TbCircleLetterN, TbCircleLetterO,
  TbCircleLetterP, TbCircleLetterQ, TbCircleLetterR, TbCircleLetterS, TbCircleLetterT,
  TbCircleLetterU, TbCircleLetterV, TbCircleLetterW, TbCircleLetterX, TbCircleLetterY,
  TbCircleLetterZ
} from "react-icons/tb";

// Map of filled letter icons
const filledLetterIcons: { [key: string]: IconType } = {
  'A': TbCircleLetterAFilled, 'B': TbCircleLetterBFilled, 'C': TbCircleLetterCFilled, 'D': TbCircleLetterDFilled,
  'E': TbCircleLetterEFilled, 'F': TbCircleLetterFFilled, 'G': TbCircleLetterGFilled, 'H': TbCircleLetterHFilled,
  'I': TbCircleLetterIFilled, 'J': TbCircleLetterJFilled, 'K': TbCircleLetterKFilled, 'L': TbCircleLetterLFilled,
  'M': TbCircleLetterMFilled, 'N': TbCircleLetterNFilled, 'O': TbCircleLetterOFilled, 'P': TbCircleLetterPFilled,
  'Q': TbCircleLetterQFilled, 'R': TbCircleLetterRFilled, 'S': TbCircleLetterSFilled, 'T': TbCircleLetterTFilled,
  'U': TbCircleLetterUFilled, 'V': TbCircleLetterVFilled, 'W': TbCircleLetterWFilled, 'X': TbCircleLetterXFilled,
  'Y': TbCircleLetterYFilled, 'Z': TbCircleLetterZFilled
};

// Map of outline letter icons
const outlineLetterIcons: { [key: string]: IconType } = {
  'A': TbCircleLetterA, 'B': TbCircleLetterB, 'C': TbCircleLetterC, 'D': TbCircleLetterD,
  'E': TbCircleLetterE, 'F': TbCircleLetterF, 'G': TbCircleLetterG, 'H': TbCircleLetterH,
  'I': TbCircleLetterI, 'J': TbCircleLetterJ, 'K': TbCircleLetterK, 'L': TbCircleLetterL,
  'M': TbCircleLetterM, 'N': TbCircleLetterN, 'O': TbCircleLetterO, 'P': TbCircleLetterP,
  'Q': TbCircleLetterQ, 'R': TbCircleLetterR, 'S': TbCircleLetterS, 'T': TbCircleLetterT,
  'U': TbCircleLetterU, 'V': TbCircleLetterV, 'W': TbCircleLetterW, 'X': TbCircleLetterX,
  'Y': TbCircleLetterY, 'Z': TbCircleLetterZ
};

/**
 * Get the appropriate letter icon component based on the first letter of a string
 * and whether it should be filled or not
 * 
 * @param text - The text to get the first letter from
 * @param filled - Whether to use the filled version of the icon
 * @returns The appropriate icon component or a default icon if the letter isn't found
 */
export function getLetterIcon(text: string, filled: boolean = false) {
  // Get first letter and convert to uppercase
  const firstLetter = text.trim().charAt(0).toUpperCase();
  
  // Get the appropriate icon map
  const iconMap = filled ? filledLetterIcons : outlineLetterIcons;
  
  // Return the icon component or default to 'A' if letter not found
  return iconMap[firstLetter] || (filled ? TbCircleLetterAFilled : TbCircleLetterA);
}

/**
 * Determine if a match item should use a filled icon based on its position
 * 
 * @param index - The index of the match item in the list
 * @returns boolean indicating whether to use filled icon
 */
export function shouldUseFilled(index: number): boolean {
  return index % 2 === 0;
} 