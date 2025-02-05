import Button from "@/components/ui/Button";

export default function Home() {
  const handleClick = () => {
    alert("Application form is not available yet");
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-center mb-6">
        Welcome to Amusement Park recruitment application
      </h1>
      <Button>Apply now</Button>
    </div>
  );
}
