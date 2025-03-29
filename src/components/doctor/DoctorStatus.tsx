import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { CheckCircleIcon, XCircleIcon, ClockIcon, CalendarIcon } from 'lucide-react';

export type DoctorStatusType = 'available' | 'busy' | 'offline' | 'scheduled';

interface DoctorStatusProps {
  initialStatus?: DoctorStatusType;
  doctorId: string;
  onStatusChange?: (status: DoctorStatusType) => void;
  readonly?: boolean;
}

export const DoctorStatus: React.FC<DoctorStatusProps> = ({
  initialStatus = 'offline',
  doctorId,
  onStatusChange,
  readonly = false,
}) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<DoctorStatusType>(initialStatus);
  
  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);
  
  const handleStatusChange = (newStatus: DoctorStatusType) => {
    if (readonly) return;
    
    setStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };
  
  const getStatusColor = (statusType: DoctorStatusType): string => {
    switch (statusType) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'busy':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'offline':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusIcon = (statusType: DoctorStatusType) => {
    switch (statusType) {
      case 'available':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'busy':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'offline':
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
      case 'scheduled':
        return <CalendarIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };
  
  const statusOptions: DoctorStatusType[] = ['available', 'busy', 'offline', 'scheduled'];
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">{t('doctorStatus')}</h2>
        
        {/* Current status display */}
        <div className={`flex items-center p-3 rounded-lg border ${getStatusColor(status)} mb-4`}>
          {getStatusIcon(status)}
          <span className="ml-2 font-medium">
            {status === 'available' && t('statusAvailable')}
            {status === 'busy' && t('statusBusy')}
            {status === 'offline' && t('statusOffline')}
            {status === 'scheduled' && t('statusScheduled')}
          </span>
        </div>
        
        {/* Status change options */}
        {!readonly && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">{t('changeStatus')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((statusOption) => (
                <button
                  key={statusOption}
                  onClick={() => handleStatusChange(statusOption)}
                  className={`flex items-center justify-center p-3 rounded-lg border transition-colors ${
                    status === statusOption
                      ? getStatusColor(statusOption) + ' font-medium'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {getStatusIcon(statusOption)}
                  <span className="ml-2">
                    {statusOption === 'available' && t('statusAvailable')}
                    {statusOption === 'busy' && t('statusBusy')}
                    {statusOption === 'offline' && t('statusOffline')}
                    {statusOption === 'scheduled' && t('statusScheduled')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Status explanation */}
        <div className="mt-4 text-sm text-gray-600">
          <h3 className="font-medium text-gray-700 mb-2">{t('statusExplanation')}</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
              <span>{t('statusAvailableExplanation')}</span>
            </li>
            <li className="flex items-start">
              <XCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
              <span>{t('statusBusyExplanation')}</span>
            </li>
            <li className="flex items-start">
              <ClockIcon className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
              <span>{t('statusOfflineExplanation')}</span>
            </li>
            <li className="flex items-start">
              <CalendarIcon className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
              <span>{t('statusScheduledExplanation')}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 