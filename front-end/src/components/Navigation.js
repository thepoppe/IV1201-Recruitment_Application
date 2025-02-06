import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Navigation() {
  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            {/* Text logo link to home */}
            <Link href="/" className="text-xl font-bold">
              Amusement Park
            </Link>
          </div>
          <div className="flex gap-4">
            {/* Login button */}
            <Button variant="text">Login</Button>
            {/* Create Account button */}
            <Link href="/create-account">
              <Button variant="primary">Create Account</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
