import React from "react";
import { ResumeSchema } from "@kurone-kito/jsonresume-types";
import { Basics } from "./Basics";

export const Resume: React.FC<{ resume: ResumeSchema }> = ({ resume }) => (
  <div id="resume">
    <Basics {...resume.basics} />
  </div>
);
