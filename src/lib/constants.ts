import { Clock, BookOpen, Users, Globe, User, LucideIcon } from "lucide-react";

interface CourseItem {
  icon: LucideIcon;
  label: string;
  value: string;
}

export const courses: CourseItem[] = [
  { icon: User, label: "Instructor", value: "Edward Norton" },
  { icon: Clock, label: "Duration", value: "3 weeks" },
  { icon: BookOpen, label: "Lessons", value: "8" },
  { icon: Users, label: "Enrolled", value: "65 students" },
  { icon: Globe, label: "Language", value: "English" },
];

export const weeks = [
  {
    title: "Week 5-8",
    subtitle:
      "Advanced story telling techniques for writers: Personas, Characters & Plots",
    lessons: [
      {
        title: "Defining Functions",
        locked: true,
        description:
          "Learn how to define reusable functions in JavaScript and understand how they improve code organization.",
      },
      {
        title: "Return Values From Functions",
        questions: [
          {
            question: "What does a 'return' statement do in a function?",
            options: [
              "Stops the function without returning anything",
              "Outputs a value from the function",
              "Defines a new variable",
            ],
            correct: 1,
          },
          {
            question: "Can a function return multiple values directly?",
            options: ["Yes", "No"],
            correct: 1,
          },
        ],
        time: "15 MINUTES",
        description:
          "Understand how to use return statements to output values from functions effectively.",
      },
      {
        title: "Function Parameters",
        locked: true,
        description:
          "Explore how to pass data to functions using parameters and how arguments work in JavaScript.",
      },
      {
        title: "Global Variable and Scope",
        locked: true,
        description:
          "Discover the difference between local and global variables and how scope affects variable access.",
      },
      {
        title: "Newer Way of creating a Constant",
        locked: true,
        description:
          "Learn modern ways to declare constants and the differences between var, let, and const.",
      },
    ],
  },
  {
    title: "Week 9-12",
    subtitle: "Deep dive into narrative structure and pacing techniques",
    lessons: [
      {
        title: "Story Arcs",
        questions: [
          {
            question: "What is a story arc?",
            options: [
              "The emotional or narrative shape of a story",
              "The list of characters",
              "A random event in a story",
            ],
            correct: 0,
          },
          {
            question: "What keeps readers engaged throughout a story?",
            options: [
              "Proper pacing and conflict",
              "Excessive exposition",
              "Unrelated subplots",
            ],
            correct: 0,
          },
          {
            question: "What does a climax represent?",
            options: [
              "The introduction of the story",
              "The turning point or highest tension",
              "The ending credits",
            ],
            correct: 1,
          },
        ],
        time: "20 MINUTES",
        description:
          "Learn about story arcs and how to design them to maintain reader engagement.",
      },
      {
        title: "Global Variable and Scope",
        locked: true,
        description:
          "Discover the difference between local and global variables and how scope affects variable access.",
      },
      {
        title: "Newer Way of creating a Constant",
        locked: true,
        description:
          "Learn modern ways to declare constants and the differences between var, let, and const.",
      },
      {
        title: "Constants",
        locked: true,
        description:
          "A deeper look at constants in JavaScript and their best practices.",
      },
    ],
  },
  {
    title: "Week 13-16",
    subtitle: "Final Project: Building a Cohesive Storyline",
    lessons: [
      {
        title: "Global Variable and Scope",
        locked: true,
        description:
          "Discover the difference between local and global variables and how scope affects variable access.",
      },
      {
        title: "Newer Way of creating a Constant",
        locked: true,
        description:
          "Learn modern ways to declare constants and the differences between var, let, and const.",
      },
      {
        title: "Constants",
        locked: true,
        description:
          "A deeper look at constants in JavaScript and their best practices.",
      },
      {
        title: "Editing Techniques",
        questions: [
          {
            question: "What’s the main goal of editing?",
            options: [
              "To make the story more confusing",
              "To refine and improve clarity",
              "To add unnecessary details",
            ],
            correct: 1,
          },
        ],
        time: "10 MINUTES",
        description:
          "Explore different editing approaches to refine and polish your story.",
      },
    ],
  },
];

export const commentsData = [
  {
    avatarUrl: "https://i.pravatar.cc/100?img=5",
    title: "Alice Johnson",
    date: "Oct 22, 2025",
    description:
      "This lesson was very helpful! I finally understood how to handle state management in React.This lesson was very helpful! I finally understood how to handle state management in React.",
  },
  {
    avatarUrl: "https://i.pravatar.cc/100?img=8",
    title: "Michael Smith",
    date: "Oct 21, 2025",
    description:
      "Great explanation and examples. Would love to see more advanced topics next time! Great explanation and examples. Would love to see more advanced topics next time!",
  },
  {
    avatarUrl: "https://i.pravatar.cc/100?img=12",
    title: "Sophia Williams",
    date: "Oct 24, 2025",
    description:
      "Amazing course! The instructor made complex concepts so simple and easy to follow. Highly recommended for beginners. Amazing course! The instructor made complex concepts so simple and easy to follow. Highly recommended for beginners.",
  },
];
