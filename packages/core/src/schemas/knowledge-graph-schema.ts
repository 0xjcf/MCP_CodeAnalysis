import { z } from "zod";

const nodeTypeSchema = z.enum([
  "function", 
  "file", 
  "class", 
  "variable", 
  "dependency", 
  "concept",
  "repository"
]); 