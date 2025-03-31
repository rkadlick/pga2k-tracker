import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4 text-[--foreground]">PGA2K25 Match Tracker</h1>
        <p className="text-xl text-[--muted] max-w-2xl mx-auto">
          Track and analyze your alternate shot 2v2 matches in PGA2K25
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link 
            href="/matches/new" 
            className="inline-flex items-center space-x-2 bg-[--primary] text-[--primary-foreground]
                     hover:bg-[--primary-hover] transition-colors px-6 py-2 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Record New Match</span>
          </Link>
          <Link 
            href="/matches" 
            className="inline-flex items-center space-x-2 bg-[--card-bg] text-[--foreground] border border-[--border]
                     hover:bg-[--primary]/5 transition-colors px-6 py-2 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>View Match History</span>
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <FeatureCard 
          title="Match History" 
          description="View all your past matches with detailed results and statistics."
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
    <div className="card hover:bg-[--primary]/5 animate-fade-in">
      <div className="p-6">
        <div className="w-10 h-10 mb-4 rounded-lg bg-[--primary]/10 text-[--primary] 
                      flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {icon}
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2 text-[--foreground]">{title}</h2>
        <p className="text-[--muted] mb-4">{description}</p>
        <Link 
          href={link} 
          className="inline-flex items-center text-[--primary] hover:text-[--primary-hover] font-medium"
        >
          Learn more
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
