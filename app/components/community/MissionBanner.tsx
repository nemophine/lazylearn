'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Clock, Heart, Sparkles } from 'lucide-react';

import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import type {
  MissionProofResponse,
  MissionSummary,
} from '../../lib/types/missions';

const REFRESH_INTERVAL_MS = 15_000;

interface MissionState {
  mission?: MissionSummary;
  isLoading: boolean;
  isError: boolean;
}

interface ProofState {
  data?: MissionProofResponse['proof'];
  isLoading: boolean;
  isError: boolean;
}

function formatNumber(value: number) {
  return value.toLocaleString('th-TH');
}

function formatTimeRemaining(deadlineIso: string) {
  const deadline = new Date(deadlineIso).getTime();
  const now = Date.now();
  const diff = deadline - now;
  if (diff <= 0) return 'ภารกิจสรุปผลแล้ว';
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff / (60 * 60 * 1000)) % 24);
  if (days > 0) return `เหลือเวลาอีก ${days} วัน ${hours} ชม.`;
  const minutes = Math.floor((diff / (60 * 1000)) % 60);
  return `เหลือเวลาอีก ${hours} ชม. ${minutes} นาที`;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

async function fetchMission(): Promise<MissionSummary> {
  const url = API_BASE_URL
    ? `${API_BASE_URL}/api/v1/missions/current`
    : '/api/missions/current';

  const response = await fetch(url, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to load mission data');
  }
  const payload = (await response.json()) as { mission: MissionSummary };
  return payload.mission;
}

async function fetchProof(
  proofId: string,
): Promise<MissionProofResponse['proof']> {
  const url = API_BASE_URL
    ? `${API_BASE_URL}/api/v1/missions/proof/${proofId}`
    : `/api/missions/proof/${proofId}`;

  const response = await fetch(url, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to load mission proof');
  }
  const payload = (await response.json()) as MissionProofResponse;
  return payload.proof;
}

export function MissionBanner() {
  const [missionState, setMissionState] = useState<MissionState>({
    isLoading: true,
    isError: false,
  });
  const [proofState, setProofState] = useState<ProofState>({
    isLoading: false,
    isError: false,
  });
  const [isProofDialogOpen, setIsProofDialogOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let timeout: NodeJS.Timeout;

    const loadMission = async () => {
      try {
        const mission = await fetchMission();
        if (!isMounted) return;
        setMissionState({ mission, isLoading: false, isError: false });
      } catch {
        if (!isMounted) return;
        setMissionState((previous) => ({
          mission: previous.mission,
          isLoading: false,
          isError: true,
        }));
      } finally {
        if (isMounted) {
          timeout = setTimeout(loadMission, REFRESH_INTERVAL_MS);
        }
      }
    };

    loadMission();

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const mission = missionState.mission;
  const progressPercent = useMemo(() => {
    if (!mission) return 0;
    return Math.min(100, Math.round((mission.progress / mission.goal) * 100));
  }, [mission]);

  const remainingCopy = mission
    ? formatTimeRemaining(mission.deadline)
    : 'กำลังโหลด...';

  const handleOpenProof = async () => {
    if (!mission?.proofId) return;
    setIsProofDialogOpen(true);
    if (proofState.data || proofState.isLoading) return;
    try {
      setProofState({ isLoading: true, isError: false });
      const proof = await fetchProof(mission.proofId);
      setProofState({ data: proof, isLoading: false, isError: false });
    } catch {
      setProofState({ isLoading: false, isError: true });
    }
  };

  const statusCopy = mission?.status === 'success'
    ? 'ภารกิจสำเร็จ! ขอบคุณทุกหัวใจที่ร่วมสร้างผลลัพธ์'
    : mission?.status === 'active'
    ? 'รวมพลังหัวใจเพื่อสร้างผลลัพธ์จริงให้ชุมชน'
    : 'ภารกิจใหม่กำลังจะเริ่มในเร็ว ๆ นี้';

  return (
    <>
      <Card className="bg-gradient-to-br from-[var(--teal-400)] via-[var(--teal-300)] to-[var(--teal-200)] text-white border-0 shadow-lg">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-white/80">
                <Sparkles className="w-4 h-4" />
                Purpose Mission
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold">
                {mission ? mission.title : 'กำลังโหลดภารกิจ...'}
              </h2>
              <p className="text-white/90">
                {mission ? mission.tagline : 'เรากำลังเชื่อมแรงบันดาลใจของทุกคนให้กลายเป็นผลลัพธ์ที่จับต้องได้'}
              </p>
              <p className="text-sm text-white/80">{statusCopy}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    {mission ? formatNumber(mission.progress) : '—'} / {mission ? formatNumber(mission.goal) : '—'} แต้มหัวใจ
                  </span>
                  <span>{mission ? `${progressPercent}%` : ''}</span>
                </div>
                <Progress value={progressPercent} className="h-3 bg-white/20" />
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Clock className="w-4 h-4" />
                  {missionState.isLoading ? 'กำลังซิงค์...' : remainingCopy}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[240px]">
              <div className="bg-white/15 rounded-2xl p-4">
                <p className="text-sm text-white/80 mb-3">
                  รวมแล้ว
                  <span className="mx-1 text-white font-medium">
                    {mission ? formatNumber(mission.heartsRaised) : '—'}
                  </span>
                  หัวใจจากผู้เรียน
                  <span className="mx-1 text-white font-medium">
                    {mission ? formatNumber(mission.contributors) : '—'}
                  </span>
                  คน
                </p>
                <p className="text-xs text-white/70">
                  ทุกการดูวิดีโอและการแบ่งปันความรู้ เปลี่ยนเป็นการสนับสนุนหนังสือชุดใหม่ให้กับเยาวชน
                </p>
              </div>

              {mission?.status === 'success' && mission.proofId ? (
                <Button
                  onClick={handleOpenProof}
                  className="bg-white text-[var(--teal-700)] hover:bg-white/90 rounded-full"
                >
                  ดูผลลัพธ์ภารกิจของพวกเรา!
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button className="bg-white text-[var(--teal-700)] hover:bg-white/90 rounded-full">
                  เติมหัวใจให้ภารกิจนี้
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isProofDialogOpen} onOpenChange={setIsProofDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>หลักฐานผลกระทบจากภารกิจ</DialogTitle>
            <DialogDescription>
              นี่คือผลลัพธ์ที่ชุมชนของเราร่วมกันสร้างขึ้น
            </DialogDescription>
          </DialogHeader>
          {proofState.isLoading && (
            <p className="text-sm text-muted-foreground">กำลังโหลดข้อมูล...</p>
          )}
          {proofState.isError && (
            <p className="text-sm text-red-500">ไม่สามารถโหลดหลักฐานได้ในขณะนี้</p>
          )}
          {proofState.data && (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed">{proofState.data.summary}</p>
              <div>
                <p className="text-sm font-medium mb-2">ไฮไลต์ที่น่าภูมิใจ</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {proofState.data.impactHighlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 text-[var(--teal-500)]">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-muted-foreground">
                ส่งมอบเมื่อ {new Date(proofState.data.deliveredOn).toLocaleDateString('th-TH')}
                {' '}ร่วมกับ {proofState.data.partner}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
