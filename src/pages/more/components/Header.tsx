import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  onBack: () => void;
}

const Header = ({ title, onBack }: HeaderProps) => (
  <div className="flex items-center p-4">
    <ArrowLeft
      className="w-6 h-6 text-gray-600 cursor-pointer"
      onClick={onBack}
    />
    <h1 className="flex-1 text-center font-semibold text-lg">{title}</h1>
  </div>
);

export default Header;