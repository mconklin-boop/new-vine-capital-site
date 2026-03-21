import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#8c6a2d]/15 bg-[#050505]">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="New Vine Capital logo"
              width={42}
              height={42}
            />
            <div>
              <div className="text-sm font-semibold tracking-[0.18em] text-[#d7bb74]">
                NEW VINE CAPITAL
              </div>
              <div className="text-xs text-[#9f9a89]">
                Private Lending • Strategic Capital
              </div>
            </div>
          </div>

          <div className="text-sm text-[#9f9a89]">
            deals@newvinecapital.com • 720-817-4277 • 1500 N Grant St #7339 Denver, CO 80203
          </div>

        </div>
      </div>
    </footer>
  );
}
