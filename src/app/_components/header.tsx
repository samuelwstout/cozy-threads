"use client";

import { ShoppingBagIcon } from "@heroicons/react/24/outline";

export default function Header() {
  return (
    <div className="bg-white">
      <header className="relative">
        <nav aria-label="Top">
          <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="border-b border-gray-200">
                <div className="flex h-16 items-center justify-between">
                  <div className="hidden lg:flex lg:flex-1 lg:items-center">
                    <a href="#">
                      <span>COZY THREADS</span>
                    </a>
                  </div>

                  <a href="#" className="lg:hidden">
                    <span>COZY THREADS</span>
                  </a>

                  <div className="flex flex-1 items-center justify-end">
                    <div className="flex items-center lg:ml-8">
                      <div className="ml-4 flow-root lg:ml-8">
                        <a
                          href="#"
                          className="group -m-2 flex items-center p-2"
                        >
                          <ShoppingBagIcon
                            aria-hidden="true"
                            className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                            0
                          </span>
                          <span className="sr-only">
                            items in cart, view bag
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
