import baseLayout from './print-base-layout';
import sections from './print-sections';

export default `/* Print */
@media print {
${baseLayout}
${sections}
}`;
