export default function Footer() {
  return (
    <div className="bg-white">
      <header className="relative">
        <nav aria-label="Bottom">
          <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="border-t border-gray-200">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex flex-1 items-center justify-end">
                    <div className="flex items-center lg:ml-8">
                      <div className="ml-4 flow-root lg:ml-8">
                        <a
                          href="/admin"
                          className="group -m-2 flex items-center p-2"
                        >
                          <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                            Admin panel
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
