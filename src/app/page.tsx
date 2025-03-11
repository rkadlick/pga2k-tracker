// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">PGA2K25 Match Tracker</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Track and analyze your alternate shot 2v2 matches in PGA2K25
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link 
            href="/matches/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Record New Match
          </Link>
          <Link 
            href="/matches" 
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md transition-colors"
          >
            View Match History
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <FeatureCard 
          title="Match History" 
          description="View all your past matches with detailed results and statistics."
          link="/matches"
        />
        <FeatureCard 
          title="Manage Courses" 
          description="Add and edit courses with hole details for more accurate tracking."
          link="/courses"
        />
        <FeatureCard 
          title="Team Stats" 
          description="See performance statistics for different teams and matchups."
          link="/teams"
        />
      </section>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  link: string;
}

function FeatureCard({ title, description, link }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link href={link} className="text-blue-600 hover:text-blue-800 font-medium">
        Learn more →
      </Link>
    </div>
  );
}
