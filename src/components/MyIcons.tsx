import { BookOpen, Layers, Library, FileText } from "lucide-react";

const MyIcons = () => {
  return (
    <div className="flex space-x-8 text-2xl my-7 bg-white pb-5">
      <div className="p-2 border-2 border-gray-500 rounded-full cursor-pointer group">
        <FileText className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
      </div>

      <div className="p-2 border-2 border-gray-500 rounded-full cursor-pointer group">
        <BookOpen className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
      </div>

      <div className="p-2 border-2 border-gray-500 rounded-full cursor-pointer group">
        <Layers className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
      </div>

      <div className="p-2 border-2 border-gray-500 rounded-full cursor-pointer group">
        <Library className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
      </div>
    </div>
  );
};

export default MyIcons;
