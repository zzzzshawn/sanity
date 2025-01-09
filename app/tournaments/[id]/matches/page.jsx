'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';


export default function TournamentMatches({ params }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const unwrappedId = React.use(params);

  useEffect(() => {
    fetchMatches();
  }, [unwrappedId.id]);

  const fetchMatches = async () => {
    try {
      const response = await fetch(`/api/tournaments/${unwrappedId.id}/matches`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      setMatches(data.matches);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateMatchResult = async (matchId, winner, score) => {
    try {
      const response = await fetch(`/api/tournaments/${unwrappedId.id}/matches`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matchId, winner, score }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      // Refresh matches after update
      fetchMatches();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading matches...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tournament Matches</h1>
      
      <div className="grid gap-4">
        {matches.map((match) => (
          <div 
            key={match.id} 
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  Round {match.round_number} - {match.stage_name}
                </p>
                <div className="mt-2 space-y-2">
                  <p className="font-semibold">{match.opponent1_name}</p>
                  <p className="text-gray-500">vs</p>
                  <p className="font-semibold">{match.opponent2_name}</p>
                </div>
              </div>
              
              {session && match.status !== 3 && (
                <div className="flex-shrink-0 ml-4">
                  <button
                    onClick={() => updateMatchResult(match.id, 1, '1-0')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Update Result
                  </button>
                </div>
              )}

              {match.status === 3 && (
                <div className="text-green-600 font-semibold">
                  Completed
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 