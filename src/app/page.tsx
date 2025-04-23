import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 mb-8">
          <div className="hidden lg:block relative w-[200px] h-[400px]">
            <Image
              src="/rk.png"
              alt="Golfer on left"
              fill
              style={{ objectFit: 'contain' }}
              className="rounded-lg"
            />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-4 text-[--foreground]">PGA2K25 Match Tracker</h1>
            <p className="text-xl text-[--muted] max-w-2xl mx-auto">
              Tracking and analyzing alternate shot 2v2 matches in PGA2K25
            </p>
          </div>
          <div className="hidden lg:block relative w-[200px] h-[400px]">
            <Image
              src="/tj.png"
              alt="Golfer on right"
              fill
              style={{ objectFit: 'contain' }}
              className="rounded-lg"
            />
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <FeatureCard 
          title="Match History" 
          description="View all past matches with detailed results and statistics."
          link="/matches"
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          }
        />
        <FeatureCard 
          title="Manage Courses" 
          description="Add and edit courses with hole details for more accurate tracking."
          link="/courses"
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          }
        />
        <FeatureCard 
          title="Team Stats" 
          description="See performance statistics for different teams and matchups."
          link="/teams"
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M18 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          }
        />
      </section>

      {/* Responsive images section below cards */}
      <section className="flex md:hidden justify-center gap-4 py-2 mb-2">
        <div className="relative w-[100px] h-[200px]">
          <Image
            src="/rk.png"
            alt="Golfer on left"
            fill
            style={{ objectFit: 'contain' }}
            className="rounded-lg"
          />
        </div>
        <div className="relative w-[100px] h-[200px]">
          <Image
            src="/tj.png"
            alt="Golfer on right"
            fill
            style={{ objectFit: 'contain' }}
            className="rounded-lg"
          />
        </div>
      </section>

      <section className="hidden md:flex lg:hidden justify-center gap-8 py-2 mb-2">
        <div className="relative w-[150px] h-[300px]">
          <Image
            src="/rk.png"
            alt="Golfer on left"
            fill
            style={{ objectFit: 'contain' }}
            className="rounded-lg"
          />
        </div>
        <div className="relative w-[150px] h-[300px]">
          <Image
            src="/tj.png"
            alt="Golfer on right"
            fill
            style={{ objectFit: 'contain' }}
            className="rounded-lg"
          />
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}

function FeatureCard({ title, description, link, icon }: FeatureCardProps) {
  return (
    <Link href={link} className="block card hover:bg-[var(--primary)]/5 transition-colors duration-150 h-[230px]">
      <div className="px-4 md:px-5 py-3 h-full flex flex-col">
        {/* Icon and Title - Fixed Height */}
        <div className="flex items-center gap-3 h-[68px]">
          <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center text-[var(--primary)]">
            <svg className="w-11 h-11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {icon}
            </svg>
          </div>
          <h2 className="card-title text-base md:text-lg line-clamp-2">{title}</h2>
        </div>

        {/* Description - Fixed Height */}
        <div className="flex-1 py-3">
          <p className="card-meta line-clamp-3">{description}</p>
        </div>

        {/* Action - Fixed Height */}
        <div className="h-[52px] pt-3 border-t border-[var(--border)]">
          <span className="card-action group py-2 flex items-center justify-center gap-2">
            Learn more
            <svg 
              className="w-[18px] h-[18px] text-[var(--muted)] group-hover:text-[var(--primary)] transition-colors duration-150" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
