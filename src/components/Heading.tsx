type HeadingProps = {
  title: string;
  className?: string;
};

const Heading = ({ title, className }: HeadingProps) => {
  return <h2 className={`text-2xl font-medium ${className}`}>{title}</h2>;
};

export default Heading;
