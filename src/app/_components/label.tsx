"use client";

interface LabelProps {
  label: string;
  required?: boolean;
}
const FormLabel: React.FC<LabelProps> = ({ label, required }) => {
  return (
    <div>
      <label className="text-sm text-white">{label}</label>
      {required && <span className="text-red-500"> *</span>}
    </div>
  );
};

export default FormLabel;
