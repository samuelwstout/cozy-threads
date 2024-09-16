import { ShoppingBagIcon } from "@heroicons/react/24/outline";

export default function Header() {
  return (
    <div className="sticky top-0 border-b-2 border-b-neutral-300 mx-3 py-8 flex flex-row justify-center items-center bg-white z-10">
      <span>COZY THREADS</span>
      <div className="absolute right-4 p-5">
        <a href="#" className="flex items-center p-2">
          <ShoppingBagIcon className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
          <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
            0
          </span>
        </a>
      </div>
    </div>
  );
}
