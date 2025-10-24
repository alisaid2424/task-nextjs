import { commentsData } from "@/lib/constants";
import { CommentItem } from "./CommentItem";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Heading from "./Heading";

const Comments = () => {
  return (
    <section>
      <Heading title="Comments" className="mt-10 mb-5" />

      <div className="space-y-4">
        {commentsData.map((comment, index) => (
          <CommentItem
            key={index}
            avatarUrl={comment.avatarUrl}
            title={comment.title}
            date={comment.date}
            description={comment.description}
          />
        ))}
      </div>

      {/* Add Comment Area */}
      <div className="space-y-7 my-10">
        <Textarea
          placeholder="Write a comment..."
          rows={6}
          className="w-full border rounded-md shadow-lg focus-visible:ring-1 focus-visible:ring-[#41B69D]"
        />

        <Button
          size="lg"
          className="group cursor-pointer bg-[#41B69D] hover:bg-teal-500 transition-colors !py-6"
        >
          Submit Review
          <ArrowRight className="ms-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </section>
  );
};

export default Comments;
