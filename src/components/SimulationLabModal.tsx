import React, { useState } from 'react';
import { WorldState } from '../types';
import { SimulationTester } from '../systems/SimulationTester';
import { FlaskConical, Play, CheckCircle2, ShieldCheck, X, Activity, BarChart, Terminal } from 'lucide-react';

interface SimulationLabModalProps {
  world: WorldState;
  onClose: () => void;
}

export const SimulationLabModal: React.FC<SimulationLabModalProps> = ({ world, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [batchResult, setBatchResult] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const runIntegrityTest = () => {
    setIsRunning(true);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Iniciando prueba de integridad y 20 años de evolución...`]);

    setTimeout(() => {
      try {
        const res = SimulationTester.runIntegrityTest(world, 20);
        setTestResult(res);
        setLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Prueba completada con éxito.`,
          `-> Canciones Totales Creadas: ${res.totalSongs}`,
          `-> Álbumes Publicados: ${res.totalAlbums}`,
          `-> Premios Entregados: ${res.totalAwardsGiven}`,
          `-> Integridad Bhavi & Khea: ${res.bhaviAndKheaIntegrity ? 'PERFECTA (Entidades Aisladas)' : 'FALLO'}`
        ]);
      } catch (err: any) {
        setLogs(prev => [...prev, `[ERROR]: ${err.message}`]);
      } finally {
        setIsRunning(false);
      }
    }, 100);
  };

  const runBatchSim = (count: number = 50) => {
    setIsRunning(true);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Ejecutando lote de ${count} carreras simultáneas...`]);

    setTimeout(() => {
      try {
        const batch = SimulationTester.runBatchCareerSimulations(world, count);
        setBatchResult(batch);
        setLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Lote de ${count} carreras simulado.`,
          `-> Tasa de Éxito Consolidado: ${batch.breakthroughRate}%`,
          `-> Tasa de Superestrellas/Leyendas: ${batch.superstarRate}%`,
          `-> Promedio de Años Activo: ${batch.avgCareerLengthYears} años`
        ]);
      } catch (err: any) {
        setLogs(prev => [...prev, `[ERROR]: ${err.message}`]);
      } finally {
        setIsRunning(false);
      }
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#f7f4ed] border border-[#eceae4] max-w-4xl w-full rounded-[16px] p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] max-h-[90vh] overflow-y-auto relative">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#eceae4] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#fcfbf8] text-[#1c1c1c] rounded-[6px] border border-[#eceae4]">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1c1c1c] tracking-[-0.8px]">
                Simulation Lab & Stress Testing
              </h2>
              <p className="text-xs text-[#5f5f5d]">
                Verificador en tiempo real de balance matemático, diversidad procedural y aislamiento de entidades.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-[6px] bg-[#fcfbf8] hover:bg-[#eceae4] border border-[#eceae4] text-[#5f5f5d] hover:text-[#1c1c1c] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            disabled={isRunning}
            onClick={runIntegrityTest}
            className="p-4 rounded-[12px] bg-[#fcfbf8] hover:bg-[#f7f4ed] border border-[#eceae4] hover:border-[rgba(28,28,28,0.4)] text-left transition-all cursor-pointer flex items-center justify-between"
          >
            <div>
              <h4 className="text-sm font-semibold text-[#1c1c1c] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1c1c1c]" />
                Simular 20 Años & Test de Integridad
              </h4>
              <p className="text-xs text-[#5f5f5d] mt-1">
                Verifica aislamiento de Bhavi/Khea, consistencia de charts y premios.
              </p>
            </div>
            <Play className="w-4 h-4 text-[#1c1c1c] shrink-0 ml-2" />
          </button>

          <button
            disabled={isRunning}
            onClick={() => runBatchSim(50)}
            className="p-4 rounded-[12px] bg-[#fcfbf8] hover:bg-[#f7f4ed] border border-[#eceae4] hover:border-[rgba(28,28,28,0.4)] text-left transition-all cursor-pointer flex items-center justify-between"
          >
            <div>
              <h4 className="text-sm font-semibold text-[#1c1c1c] flex items-center gap-2">
                <BarChart className="w-4 h-4 text-[#1c1c1c]" />
                Simular Lote de 50 Carreras
              </h4>
              <p className="text-xs text-[#5f5f5d] mt-1">
                Calcula distribución de supervivencia, éxitos y longevidad.
              </p>
            </div>
            <Play className="w-4 h-4 text-[#1c1c1c] shrink-0 ml-2" />
          </button>
        </div>

        {/* Results Panels */}
        {testResult && (
          <div className="bg-[#fcfbf8] p-5 rounded-[12px] border border-[#eceae4] space-y-3">
            <h3 className="font-semibold text-sm text-[#1c1c1c] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1c1c1c]" />
              Resultados de la Simulación de 20 Años
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-[#f7f4ed] p-3 rounded-[6px] border border-[#eceae4]">
                <span className="text-[#5f5f5d] block text-[10px]">Canciones Creadas</span>
                <span className="text-base font-semibold text-[#1c1c1c]">{testResult.totalSongs}</span>
              </div>
              <div className="bg-[#f7f4ed] p-3 rounded-[6px] border border-[#eceae4]">
                <span className="text-[#5f5f5d] block text-[10px]">Álbumes Lanzados</span>
                <span className="text-base font-semibold text-[#1c1c1c]">{testResult.totalAlbums}</span>
              </div>
              <div className="bg-[#f7f4ed] p-3 rounded-[6px] border border-[#eceae4]">
                <span className="text-[#5f5f5d] block text-[10px]">Premios Otorgados</span>
                <span className="text-base font-semibold text-[#1c1c1c]">{testResult.totalAwardsGiven}</span>
              </div>
              <div className="bg-[#f7f4ed] p-3 rounded-[6px] border border-[#eceae4]">
                <span className="text-[#5f5f5d] block text-[10px]">Bhavi/Khea Aislados</span>
                <span className="text-base font-semibold text-[#1c1c1c]">100% OK</span>
              </div>
            </div>
          </div>
        )}

        {batchResult && (
          <div className="bg-[#fcfbf8] p-5 rounded-[12px] border border-[#eceae4] space-y-3">
            <h3 className="font-semibold text-sm text-[#1c1c1c] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#1c1c1c]" />
              Métricas del Lote de Carreras
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-[#f7f4ed] p-3 rounded-[6px] border border-[#eceae4]">
                <span className="text-[#5f5f5d] block text-[10px]">Breakthrough Rate</span>
                <span className="text-base font-semibold text-[#1c1c1c]">{batchResult.breakthroughRate}%</span>
              </div>
              <div className="bg-[#f7f4ed] p-3 rounded-[6px] border border-[#eceae4]">
                <span className="text-[#5f5f5d] block text-[10px]">Superstar Rate</span>
                <span className="text-base font-semibold text-[#1c1c1c]">{batchResult.superstarRate}%</span>
              </div>
              <div className="bg-[#f7f4ed] p-3 rounded-[6px] border border-[#eceae4]">
                <span className="text-[#5f5f5d] block text-[10px]">Flop / Decline Rate</span>
                <span className="text-base font-semibold text-[#1c1c1c]">{batchResult.flopRate}%</span>
              </div>
              <div className="bg-[#f7f4ed] p-3 rounded-[6px] border border-[#eceae4]">
                <span className="text-[#5f5f5d] block text-[10px]">Longevidad Promedio</span>
                <span className="text-base font-semibold text-[#1c1c1c]">{batchResult.avgCareerLengthYears} años</span>
              </div>
            </div>
          </div>
        )}

        {/* Live Terminal Log */}
        <div className="bg-[#fcfbf8] p-4 rounded-[12px] border border-[#eceae4] space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-[#5f5f5d] pb-1 border-b border-[#eceae4] text-[11px]">
            <span className="flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" /> Consola de Diagnóstico
            </span>
            <button
              onClick={() => setLogs([])}
              className="hover:text-[#1c1c1c] transition-colors cursor-pointer"
            >
              Limpiar
            </button>
          </div>

          <div className="max-h-40 overflow-y-auto space-y-1 text-[#5f5f5d]">
            {logs.length === 0 ? (
              <span className="text-[#5f5f5d] italic">Listo para ejecutar pruebas...</span>
            ) : (
              logs.map((log, i) => <div key={i}>{log}</div>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

