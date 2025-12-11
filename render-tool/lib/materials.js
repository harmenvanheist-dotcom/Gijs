// lib/materials.js

export const defaultMaterials = {
  "yellow": { 
    id: "yellow",
    name: "Yellow Mapping",
    material: "Matte White Sprayed MDF", 
    finish: "Matte", 
    colorCode: "#f8f8f8",
    previewColor: "#FFD700" // The color in SketchUp
  },
  "green": { 
    id: "green",
    name: "Green Mapping",
    material: "Light Walnut Veneer", 
    finish: "Satin", 
    colorCode: "#a67c52",
    previewColor: "#008000"
  },
  "orange": { 
    id: "orange",
    name: "Orange Mapping",
    material: "Carrara Marble", 
    pattern: "Light Veins", 
    finish: "Polished",
    previewColor: "#FFA500"
  },
  "purple": { 
    id: "purple",
    name: "Purple Mapping",
    component: "Oven", 
    style: "Black Glass + Stainless Steel",
    previewColor: "#800080"
  },
  "lightblue": { 
    id: "lightblue",
    name: "Light Blue Mapping",
    component: "Wine Fridge", 
    door: "Glass", 
    frame: "Black",
    previewColor: "#ADD8E6"
  },
  "black": { 
    id: "black",
    name: "Black Mapping",
    component: "Induction Cooktop",
    previewColor: "#000000"
  },
  "grey": { 
    id: "grey",
    name: "Grey Mapping",
    component: "Sink + Black Tap",
    previewColor: "#808080"
  }
};

// Simple helper to load/save mappings from localStorage (client-side persistence for MVP)
export const getStoredMaterials = () => {
  if (typeof window === 'undefined') return defaultMaterials;
  const stored = localStorage.getItem('sketchup-materials');
  return stored ? JSON.parse(stored) : defaultMaterials;
};

export const saveMaterials = (materials) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sketchup-materials', JSON.stringify(materials));
};
