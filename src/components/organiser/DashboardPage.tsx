import React from 'react';

interface DashboardPageProps {
  eventName: string;
  eventStartDate: string;
  eventEndDate: string;
  locality: string;
  area: string;
  feesPerDelegate: string;
  numberOfSeats: string;
  totalRevenue: string;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  eventName,
  eventStartDate,
  eventEndDate,
  locality,
  area,
  feesPerDelegate,
  numberOfSeats,
  totalRevenue
}) => {
  if (!eventName) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No events available</h3>
        <p className="text-gray-500">Please create an event to view the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Event Information */}
      <div className="p-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex justify-center items-center text-white border rounded-lg border border-gray-800">
            <div className="bg-[#607DA3] text-sm font-medium px-2.5 py-2 h-full rounded-l-[5px] flex justify-center items-center">Event</div>
            <div className="text-lg text-gray-800 p-[10px]  w-full">{eventName}</div>
          </div>
          <div className="flex justify-center items-center text-white border rounded-lg border border-gray-800">
            <div className="bg-[#607DA3] text-sm font-medium px-2.5 py-2 h-full rounded-l-[5px] flex justify-center items-center">Date</div>
            <div className="text-lg text-gray-800 p-[10px] w-full">{eventStartDate} - {eventEndDate}</div>
          </div>
          <div className="flex justify-center items-center text-white border rounded-lg border border-gray-800">
            <div className="bg-[#607DA3] text-sm font-medium px-2.5 py-2 h-full rounded-l-[5px] flex justify-center items-center">Locality</div>
            <div className="text-lg text-gray-800 p-[10px] w-full">{locality}</div>
          </div>
          <div className="flex justify-center items-center text-white border rounded-lg border border-gray-800">
            <div className="bg-[#607DA3] text-sm font-medium px-2.5 py-2 h-full rounded-l-[5px] flex justify-center items-center">Area</div>
            <div className="text-lg text-gray-800 p-[10px] w-full">{area || 'N/A'}</div>
          </div>
          <div className="flex justify-center items-center text-white border rounded-lg border border-gray-800">
            <div className="bg-[#607DA3] text-sm font-medium px-2.5 py-2 h-full rounded-l-[5px] flex justify-center items-center">Fees</div>
            <div className="text-lg text-gray-800 p-[10px] w-full">AED {feesPerDelegate}</div>
          </div>
          <div className="flex justify-center items-center text-white border rounded-lg border border-gray-800">
            <div className="bg-[#607DA3] text-sm font-medium px-2.5 py-2 h-full rounded-l-[5px] flex justify-center items-center">Delegates</div>
            <div className="text-lg text-gray-800 p-[10px] w-full">{numberOfSeats || '0'}</div>
          </div>
          <div className="flex justify-center items-center text-white border rounded-lg border border-gray-800">
            <div className="bg-[#607DA3] text-sm font-medium px-2.5 py-2 h-full rounded-l-[5px] flex justify-center items-center">Total Revenue</div>
            <div className="text-lg text-gray-800 p-[10px] w-full">AED {totalRevenue || '0'}</div>
          </div>
        </div>
      </div>

      {/* Allocation Summary */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Allocation Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-[800px] border border-gray-800 w-[570px]">
            <thead >
              <tr className="bg-[#607DA3] text-white ">
                <th className="px-4 py-3 text-center border border-gray-800 w-[19%]"></th>
                <th className="px-4 py-3 text-center border border-gray-800 w-[8%]">Count</th>
                <th className="px-4 py-3 text-center border border-gray-800 w-[8%]">Seats</th>
                <th className="px-4 py-3 text-center border border-gray-800 w-[8%]">Allocated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <tr>
                <td className="px-4 py-3 text-center font-medium border border-gray-800">Total</td>
                <td className="px-4 py-3 text-center border border-gray-800">13</td>
                <td className="px-4 py-3 text-center border border-gray-800">360</td>
                <td className="px-4 py-3 text-center border border-gray-800">202</td>
              </tr>
              <tr>
                <td className="px-4 py-3  text-center font-medium border border-gray-800">Country Committees</td>
                <td className="px-4 py-3  text-center border border-gray-800">5</td>
                <td className="px-4 py-3  text-center border border-gray-800">150</td>
                <td className="px-4 py-3  text-center border border-gray-800">100</td>
              </tr>
              <tr>
                <td className="px-4 py-3  text-center font-medium border border-gray-800">Crisis Committees</td>
                <td className="px-4 py-3  text-center border border-gray-800">4</td>
                <td className="px-4 py-3  text-center border border-gray-800">120</td>
                <td className="px-4 py-3  text-center border border-gray-800">35</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-center font-medium border border-gray-800">Role Committees</td>
                <td className="px-4 py-3 text-center border border-gray-800">3</td>
                <td className="px-4 py-3 text-center border border-gray-800">90</td>
                <td className="px-4 py-3 text-center border border-gray-800">67</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-center font-medium border border-gray-800">Open Committees</td>
                <td className="px-4 py-3 text-center border border-gray-800">0</td>
                <td className="px-4 py-3 text-center border border-gray-800">0</td>
                <td className="px-4 py-3 text-center border border-gray-800">0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Allocation Status */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Allocation Status</h2>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-5 gap-2 w-[840px]">
            {/* Header Row */}
            <div className="bg-[#607DA3] text-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center justify-between">
              <span>Committee Type</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="bg-[#607DA3] text-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center justify-between">
              <span>Committees</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="bg-[#607DA3] text-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center justify-between">
              <span>Seats Total</span>
            </div>
            <div className="bg-[#607DA3] text-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center justify-between">
              <span>Seats Assigned</span>
            </div>
            <div className="bg-[#607DA3] text-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center justify-between">
              <span>Status</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Data Row 1 */}
            <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">Country</div>
            <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center font-medium">WHO</div>
            <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">30</div>
            <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">30</div>
            <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">
              <span className="text-red-600 font-medium">Full</span>
            </div>

            {/* Data Row 2 */}
            <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">Country</div>
            <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center font-medium">UNGA</div>
            <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">30</div>
            <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">25</div>
            <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">
              <span className="text-orange-600 font-medium">Filling</span>
            </div>

            {/* Data Row 3 */}
            <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">Crisis</div>
            <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center font-medium">CMC</div>
            <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">30</div>
            <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">10</div>
            <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">
              <span className="text-green-600 font-medium">Open</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
