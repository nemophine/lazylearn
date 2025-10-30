'use client';

import { MessageCircle, Heart, Share2, Sparkles, ArrowUpRight, Send } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MissionBanner } from '../community/MissionBanner';

export function CommunityPage() {
  const qaThreads = [
    {
      id: 1,
      user: 'Emma Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
      time: '2 ชั่วโมงที่แล้ว',
      content:
        'ฉันลองใช้ Focus Mode กับเทคนิคจด bullet journal แล้วรู้สึกจัดการสมาธิได้ดีขึ้นมาก ใครมีวิธีรับมือกับความเครียดท้ายสัปดาห์บ้าง?',
      hearts: 320,
      replies: 12,
      tags: ['Focus Mode', 'ADHD Support'],
    },
    {
      id: 2,
      user: 'Alex Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      time: '5 ชั่วโมงที่แล้ว',
      content:
        'ตั้งเป้าหมายอ่านหนังสือจบ 3 บทเพื่อเติมหัวใจให้ภารกิจหนังสือเด็ก เพิ่มโฟกัสยังไงดีครับสำหรับคนติดเกม?',
      hearts: 210,
      replies: 9,
      tags: ['Game Reset', 'Heart Points'],
    },
    {
      id: 3,
      user: 'Sarah Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      time: 'เมื่อวาน',
      content:
        'แชร์โปสเตอร์ที่เราทำให้ภารกิจ! การร่วมมือกับเพื่อนๆ ทำให้รู้สึกไม่โดดเดี่ยวเลย ❤️',
      hearts: 540,
      replies: 18,
      tags: ['Creative Proof', 'Purpose Stories'],
    },
  ];

  const supportCircles = [
    {
      id: 'adhd-foundations',
      name: 'ADHD Reset Club',
      focus: 'วางโครงสร้างการเรียนรู้ที่ยืดหยุ่นและมีเพื่อนคอยช่วยเตือน',
      members: 1280,
      heartsThisWeek: 18450,
    },
    {
      id: 'game-balance',
      name: 'Game Balance Squad',
      focus: 'ปรับสมดุลระหว่างการเล่นเกมและการเรียนพร้อมโค้ชอาสา',
      members: 950,
      heartsThisWeek: 14200,
    },
    {
      id: 'low-motivation',
      name: 'Start Small Circle',
      focus: 'ฝึกสร้างนิสัยเล็ก ๆ และแชร์ชัยชนะประจำวัน',
      members: 1675,
      heartsThisWeek: 21640,
    },
  ];

  const impactStories = [
    {
      title: 'ห้องสมุดหมู่บ้านคูณกำลังใจ',
      excerpt:
        'สมาชิก Clubs ช่วยกันจัดหมวดหมู่หนังสือใหม่ 450 เล่มสำหรับเยาวชนที่ต้องการพื้นที่ปลอดภัยในการอ่าน',
      tags: ['Proof of Impact'],
    },
    {
      title: 'Peer Mentor Hotline',
      excerpt:
        'อาสาสมัคร 32 คนช่วยตอบคำถามด่วนเรื่องแผนการเรียนตลอดสัปดาห์ที่ผ่านมา ต่อยอดเป็นหัวใจเพิ่ม 18,200 แต้ม',
      tags: ['Mentorship', 'Heart Points'],
    },
  ];

  return (
    <div className="pb-24 pt-4 px-4 max-w-5xl mx-auto space-y-6">
      <MissionBanner />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-dashed border-[var(--teal-200)] bg-[var(--teal-50)]">
          <CardContent className="p-5">
            <p className="text-xs uppercase text-[var(--teal-600)] tracking-wide mb-2">
              Heart Points ที่รวมได้วันนี้
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold text-[var(--teal-700)]">
                12,480
              </span>
              <Heart className="w-6 h-6 text-[var(--teal-500)]" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              ทุกหัวใจถูกส่งเข้ากองกลางเพื่อสนับสนุนภารกิจหนังสือ
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed border-[#fbcfe8] bg-[var(--peach)]/10">
          <CardContent className="p-5">
            <p className="text-xs uppercase text-[var(--coral)] tracking-wide mb-2">
              Gems ส่วนตัวของคุณ
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold text-[var(--coral)]">
                480
              </span>
              <Sparkles className="w-6 h-6 text-[var(--coral)]" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              แลกกรอบโปรไฟล์และของแต่ง Avatar ได้จาก Purpose Store
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed border-[var(--lavender)] bg-white">
          <CardContent className="p-5">
            <p className="text-xs uppercase text-[var(--lavender)] tracking-wide mb-2">
              สถานะ Focus Mode
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold">พร้อมเชื่อมต่อ</span>
              <ArrowUpRight className="w-6 h-6 text-[var(--lavender)]" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              เมื่อเปิด Focus Mode นำทางไป Community จะถูกซ่อนอัตโนมัติ
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="mb-1">Purpose Feed</h3>
                <p className="text-sm text-muted-foreground">
                  เรื่องราวจากเพื่อนเรียนที่ต้องการกำลังใจ แทนการวัดผลด้วยลำดับ
                </p>
              </div>
              <Button className="rounded-full bg-[var(--teal-400)] hover:bg-[var(--teal-500)]">
                แชร์ความคืบหน้าของฉัน
              </Button>
            </div>

            <div className="space-y-4">
              {qaThreads.map((thread) => (
                <Card key={thread.id} className="border border-[var(--teal-100)]">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={thread.avatar} />
                        <AvatarFallback>{thread.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="mb-0.5">{thread.user}</p>
                        <p className="text-xs text-muted-foreground">{thread.time}</p>
                      </div>
                    </div>
                    <p className="mb-3 text-sm leading-relaxed">{thread.content}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {thread.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-[var(--teal-100)] text-[var(--teal-600)] border-0 text-xs"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 pt-3 border-t border-border">
                      <span className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Heart className="w-4 h-4" />
                        แบ่งปันหัวใจ {thread.hearts.toLocaleString('th-TH')}
                      </span>
                      <span className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MessageCircle className="w-4 h-4" />
                        คำตอบ {thread.replies}
                      </span>
                      <button className="flex items-center gap-2 text-xs text-[var(--teal-600)] hover:text-[var(--teal-500)] transition-colors ml-auto">
                        ให้กำลังใจ
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-[var(--teal-50)] border-[var(--teal-100)]">
            <CardContent className="p-5">
              <h3 className="mb-1">Support Circles</h3>
              <p className="text-xs text-muted-foreground mb-4">
                ชมรมที่ขับเคลื่อนด้วยเป้าหมายและสถิติเพื่อการเติบโตของทุกคน
              </p>
              <div className="space-y-4">
                {supportCircles.map((circle) => (
                  <div key={circle.id} className="rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium mb-1">{circle.name}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {circle.focus}
                        </p>
                      </div>
                      <Badge className="bg-[var(--teal-400)] border-0">
                        {circle.members.toLocaleString()} คน
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        สัปดาห์นี้ {circle.heartsThisWeek.toLocaleString('th-TH')} หัวใจ
                      </span>
                      <Button size="sm" className="h-7 rounded-full bg-[var(--teal-400)] hover:bg-[var(--teal-500)] text-xs">
                        เข้าร่วมวง
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-4">
              <div>
                <h3 className="mb-1">Transparency Center</h3>
                <p className="text-xs text-muted-foreground">
                  อัปเดตผลลัพธ์จากภารกิจที่ผ่านมา โดยทีม Impact
                </p>
              </div>
              <div className="space-y-3">
                {impactStories.map((story) => (
                  <div key={story.title} className="p-3 rounded-xl border border-border bg-[var(--teal-50)]/40">
                    <p className="text-sm font-medium mb-1">{story.title}</p>
                    <p className="text-xs text-muted-foreground mb-2">{story.excerpt}</p>
                    <div className="flex gap-2">
                      {story.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-white border border-[var(--teal-200)] text-[var(--teal-600)] text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border border-[var(--teal-200)]">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="mb-1 text-[var(--teal-700)]">พร้อมส่งหัวใจดวงต่อไปไหม?</h3>
              <p className="text-sm text-muted-foreground max-w-xl">
                เขียนบันทึกความก้าวหน้า หรือชวนเพื่อนเข้าสู่ Focus Mode เพื่อเติม Heart Points ให้กับภารกิจร่วมกัน
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="rounded-full">
                ส่งข้อความกำลังใจ
              </Button>
              <Button className="rounded-full bg-[var(--teal-400)] hover:bg-[var(--teal-500)]">
                เปิดห้องสนทนา Club
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </div>
          <Button className="rounded-full bg-blue text-foreground hover:bg-white/90">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
//test

