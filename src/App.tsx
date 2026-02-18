import { useState } from 'react';
import { Building2, ChevronRight } from 'lucide-react';
import { ProjectInputForm } from './components/ProjectInputForm';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { CostBreakdown } from './components/CostBreakdown';
import { MaterialRequirements } from './components/MaterialRequirements';
import { WorkforceAllocation } from './components/WorkforceAllocation';
import { ConstructionPhases } from './components/ConstructionPhases';
import { WeeklySchedule } from './components/WeeklySchedule';
import { TimelineCompression } from './components/TimelineCompression';
import { LayoutSuggestions } from './components/LayoutSuggestions';
import {
  ProjectConfig,
  ProjectInputs,
  DEFAULT_CONFIG,
  calculateMaterialRequirements,
  calculatePhases,
  calculateCostBreakdown,
  generateWeeklySchedule,
  generateLayoutSuggestions,
} from './utils/calculationEngine';

type ViewMode = 'input' | 'results';

interface ProjectData {
  inputs: ProjectInputs;
  config: ProjectConfig;
}

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('input');
  const [config, setConfig] = useState<ProjectConfig>(DEFAULT_CONFIG);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleProjectSubmit = (data: {
    projectName: string;
    builtUpArea: number;
    numberOfFloors: number;
    projectTimeline: number;
  }) => {
    setIsLoading(true);

    setTimeout(() => {
      setProjectData({
        inputs: {
          builtUpArea: data.builtUpArea,
          numberOfFloors: data.numberOfFloors,
          projectTimeline: data.projectTimeline,
        },
        config,
      });
      setViewMode('results');
      setIsLoading(false);
    }, 1000);
  };

  const handleNewProject = () => {
    setViewMode('input');
    setProjectData(null);
  };

  const materials = projectData
    ? calculateMaterialRequirements(projectData.inputs, projectData.config)
    : [];

  const phases = projectData
    ? calculatePhases(projectData.inputs, projectData.config)
    : [];

  const costData = projectData ? calculateCostBreakdown(materials, phases) : null;

  const schedule = projectData ? generateWeeklySchedule(phases, materials) : [];

  const layoutSuggestions = projectData
    ? generateLayoutSuggestions(projectData.inputs)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="text-blue-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Construction Planning Platform
                </h1>
                <p className="text-sm text-gray-600">
                  AI-powered cost estimation and project planning
                </p>
              </div>
            </div>
            {viewMode === 'results' && (
              <button
                onClick={handleNewProject}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                New Project
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'input' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="text-blue-600" size={28} />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Create New Project
                    </h2>
                    <p className="text-sm text-gray-600">
                      Enter project details to generate comprehensive plan
                    </p>
                  </div>
                </div>
                <ProjectInputForm onSubmit={handleProjectSubmit} isLoading={isLoading} />
              </div>
            </div>

            <div className="lg:col-span-1">
              <ConfigurationPanel config={config} onChange={setConfig} />

              <div className="mt-6 bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-3">What You'll Get:</h3>
                <ul className="space-y-2">
                  {[
                    'Detailed cost breakdown',
                    'Material requirements',
                    'Workforce allocation',
                    'Phase-wise planning',
                    'Weekly schedule',
                    'Timeline simulation',
                    'AI layout suggestions',
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <ChevronRight size={16} className="text-blue-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {costData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CostBreakdown costData={costData} />
                <ConstructionPhases phases={phases} />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MaterialRequirements materials={materials} />
              <WorkforceAllocation phases={phases} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <WeeklySchedule schedule={schedule} />
              <LayoutSuggestions suggestions={layoutSuggestions} />
            </div>

            {projectData && (
              <TimelineCompression
                originalTimeline={projectData.inputs.projectTimeline}
                originalCost={costData?.totalCost || 0}
                phases={phases}
              />
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            AI-Powered Construction Planning Platform - Accurate estimates, smart planning
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
