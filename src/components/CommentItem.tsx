import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";

interface CommentItemProps {
  avatarUrl: string;
  title: string;
  date: string;
  description: string;
}

export function CommentItem({
  avatarUrl,
  title,
  date,
  description,
}: CommentItemProps) {
  return (
    <div className="flex space-x-5 border-b-2 last:border-b-0 p-4">
      <Avatar className="h-14 w-14">
        <Image
          src={avatarUrl}
          alt={title}
          width={100}
          height={100}
          className="rounded-full object-cover"
        />
      </Avatar>

      <div className="flex-1">
        <h4 className="text-sm font-normal mb-1 text-gray-700">{title}</h4>
        <span className="text-xs block text-gray-500">{date}</span>
        <p className="mt-3 text-xs text-gray-500 line-clamp-2 leading-[1.7]">
          {description}
        </p>
      </div>
    </div>
  );
}
