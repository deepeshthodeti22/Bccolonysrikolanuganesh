import React, { useState } from 'react';
import {
  Server,
  Code2,
  Workflow,
  Terminal,
  Database,
  CheckCircle2,
  Copy,
  ExternalLink,
  Play,
} from 'lucide-react';
import { useFestival } from '../context/FestivalContext';

export const BackendArchitecturePage: React.FC = () => {
  const { announcements, liveMatch, donations } = useFestival();
  const [activeTab, setActiveTab] = useState<'models' | 'views' | 'n8n' | 'api'>('models');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Mock API Tester state
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/v1/rituals/today/');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  const copyCode = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleTestEndpoint = () => {
    setIsLoadingApi(true);
    setTimeout(() => {
      if (selectedEndpoint === '/api/v1/rituals/today/') {
        setApiResponse(
          JSON.stringify(
            {
              day_number: 1,
              date: '2026-09-15',
              tithi: 'Bhadrapada Sukla Chavithi',
              rituals: [
                {
                  id: 'r1',
                  time: '06:00 AM',
                  title: 'Maha Ganapathi Pooja & Prana Pratishtha',
                  status: 'completed',
                  venue: 'Main Sanctum (Garbha Gudi)',
                  live_telecast: true,
                },
                {
                  id: 'r2',
                  time: '09:30 AM',
                  title: 'Panchamrutha Abhishekam',
                  status: 'ongoing',
                  venue: 'Yagasala Sanctum',
                  live_telecast: true,
                },
              ],
            },
            null,
            2
          )
        );
      } else if (selectedEndpoint === '/api/v1/announcements/live/') {
        setApiResponse(JSON.stringify({ status: 'success', count: announcements.length, results: announcements }, null, 2));
      } else if (selectedEndpoint === '/api/v1/scoreboard/live/') {
        setApiResponse(
          JSON.stringify(
            {
              court: liveMatch.court,
              half: liveMatch.half,
              teams: {
                [liveMatch.team1]: liveMatch.team1Score,
                [liveMatch.team2]: liveMatch.team2Score,
              },
              last_updated: new Date().toISOString(),
            },
            null,
            2
          )
        );
      } else if (selectedEndpoint === '/api/v1/donations/verify/') {
        setApiResponse(
          JSON.stringify(
            {
              total_donations_inr: 105000,
              audited: true,
              latest_receipts: donations.slice(0, 3),
            },
            null,
            2
          )
        );
      }
      setIsLoadingApi(false);
    }, 400);
  };

  const DJANGO_MODELS_CODE = `"""
B.C. Colony Ganesh Utsav Committee - Django Database Models
File: backend/festival/models.py
"""
from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator

class PriorityChoices(models.TextChoices):
    NORMAL = 'normal', 'Normal Announcement'
    URGENT = 'urgent', 'Urgent Alert'
    EMERGENCY = 'emergency', 'High Emergency Protocol'

class Announcement(models.Model):
    """Marquee news ticker, Pandal LED broadcast, and WhatsApp alerts"""
    text = models.CharField(max_length=200, help_text="Broadcast message shown on live ticker")
    priority = models.CharField(max_length=15, choices=PriorityChoices.choices, default=PriorityChoices.NORMAL)
    is_active = models.BooleanField(default=True)
    push_to_led = models.BooleanField(default=True)
    push_to_whatsapp = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.priority.upper()}] {self.text[:40]}"

class RitualDay(models.Model):
    day_number = models.PositiveSmallIntegerField(unique=True)
    date = models.DateField()
    title = models.CharField(max_length=120)
    subtitle = models.CharField(max_length=255)
    muhurtham = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Day {self.day_number}: {self.title}"

class RitualSchedule(models.Model):
    day = models.ForeignKey(RitualDay, related_name='rituals', on_delete=models.CASCADE)
    time = models.CharField(max_length=20)
    period = models.CharField(max_length=30)  # Pratah Kala, Madhyahna, Sandhya, Nisheetha
    title = models.CharField(max_length=150)
    description = models.TextField()
    venue = models.CharField(max_length=100, default='Main Sanctum')
    is_live_streamed = models.BooleanField(default=True)
    status = models.CharField(
        max_length=20,
        choices=[('upcoming', 'Upcoming'), ('ongoing', 'Ongoing Live'), ('completed', 'Completed')],
        default='upcoming'
    )

class PrasadItem(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(0)])
    unit = models.CharField(max_length=50, default='Per Box')
    available_stock = models.PositiveIntegerField(default=100)
    is_active = models.BooleanField(default=True)

class PrasadBooking(models.Model):
    token_number = models.CharField(max_length=30, unique=True)
    prasad = models.ForeignKey(PrasadItem, on_delete=models.PROTECT)
    devotee_name = models.CharField(max_length=120)
    gotram = models.CharField(max_length=80, blank=True)
    phone = models.CharField(max_length=20)
    quantity = models.PositiveIntegerField(default=1)
    pickup_slot = models.CharField(max_length=60)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20, default='CONFIRMED')
    created_at = models.DateTimeField(auto_now_add=True)

class DonationReceipt(models.Model):
    txn_id = models.CharField(max_length=40, unique=True)
    donor_name = models.CharField(max_length=120)
    gotram = models.CharField(max_length=80, blank=True)
    village = models.CharField(max_length=100)
    seva_type = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method = models.CharField(max_length=30)  # UPI, Bank, Cash
    is_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class TournamentMatch(models.Model):
    sport = models.CharField(max_length=60, default='Traditional Kabaddi')
    court = models.CharField(max_length=80, default='Main Pandal Court 1')
    team1_name = models.CharField(max_length=100)
    team2_name = models.CharField(max_length=100)
    team1_score = models.IntegerField(default=0)
    team2_score = models.IntegerField(default=0)
    current_half = models.CharField(max_length=40, default='2nd Half')
    is_live = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)`;

  const DJANGO_VIEWS_CODE = `"""
Django REST Framework ViewSets & Signal Webhooks
File: backend/festival/views.py
"""
import requests
from django.conf import settings
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Announcement, RitualDay, PrasadBooking, DonationReceipt, TournamentMatch
from .serializers import (
    AnnouncementSerializer, RitualDaySerializer, PrasadBookingSerializer,
    DonationReceiptSerializer, TournamentMatchSerializer
)

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.filter(is_active=True)
    serializer_class = AnnouncementSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        # Trigger n8n webhook asynchronously
        self._trigger_n8n_broadcast(instance)

    def _trigger_n8n_broadcast(self, announcement):
        webhook_url = getattr(settings, 'N8N_BROADCAST_WEBHOOK_URL', 'https://n8n.festival-ops.internal/webhook/broadcast')
        payload = {
            "event": "ANNOUNCEMENT_PUBLISHED",
            "id": announcement.id,
            "text": announcement.text,
            "priority": announcement.priority,
            "push_to_led": announcement.push_to_led,
            "push_to_whatsapp": announcement.push_to_whatsapp,
            "source": "B.C. Colony Committee Admin Console"
        }
        try:
            requests.post(webhook_url, json=payload, timeout=2.0)
        except Exception as e:
            # Fallback logger without blocking response
            print(f"n8n webhook dispatch non-blocking notice: {e}")

class RitualScheduleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RitualDay.objects.prefetch_related('rituals').all()
    serializer_class = RitualDaySerializer

    @action(detail=False, methods=['get'])
    def today(self, request):
        today_obj = RitualDay.objects.prefetch_related('rituals').first()
        serializer = self.get_serializer(today_obj)
        return Response(serializer.data)

class LiveScoreboardViewSet(viewsets.ModelViewSet):
    queryset = TournamentMatch.objects.filter(is_live=True)
    serializer_class = TournamentMatchSerializer

    @action(detail=False, methods=['get'])
    def current(self, request):
        match = self.queryset.first()
        if not match:
            return Response({"detail": "No active match"}, status=status.HTTP_404_NOT_FOUND)
        return Response(TournamentMatchSerializer(match).data)`;

  const N8N_WORKFLOW_CODE = `{
  "name": "Ganesh Utsav - Multi-Channel Devotee Alert Dispatcher",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "broadcast",
        "responseMode": "onReceived",
        "responseData": "allEntries"
      },
      "name": "Webhook Ingress from Django REST API",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{$json.body.push_to_whatsapp}}",
              "value2": true
            }
          ]
        }
      },
      "name": "Check WhatsApp Flag",
      "type": "n8n-nodes-base.if",
      "position": [460, 220]
    },
    {
      "parameters": {
        "url": "https://graph.facebook.com/v19.0/{{$env.WHATSAPP_PHONE_ID}}/messages",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer {{$env.META_ACCESS_TOKEN}}"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "messaging_product",
              "value": "whatsapp"
            },
            {
              "name": "to",
              "value": "{{$env.SRIKOLANU_DEVOTEE_BROADCAST_GROUP}}"
            },
            {
              "name": "type",
              "value": "text"
            },
            {
              "name": "text",
              "value": "={{$json.body.text}}"
            }
          ]
        }
      },
      "name": "Meta Cloud WhatsApp Broadcast",
      "type": "n8n-nodes-base.httpRequest",
      "position": [680, 160]
    },
    {
      "parameters": {
        "url": "http://192.168.1.120:8080/api/led/display",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "scroll_text",
              "value": "={{$json.body.text}}"
            },
            {
              "name": "speed",
              "value": "4"
            },
            {
              "name": "color",
              "value": "AMBER"
            }
          ]
        }
      },
      "name": "Pandal LED Matrix Display HTTP Dispatcher",
      "type": "n8n-nodes-base.httpRequest",
      "position": [680, 360]
    }
  ]
}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-[#FFFDF5]">
      {/* Header */}
      <section className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#800000]/70 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold shadow-lg">
          <Server className="w-3.5 h-3.5 text-amber-400" />
          <span>Full-Stack Architecture & API Specification</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-5xl font-black text-[#FFFDF5] leading-tight">
          Django REST Framework & <span className="gold-gradient-text">n8n Automation</span>
        </h1>

        <p className="text-sm sm:text-base text-amber-200/80 leading-relaxed">
          The production backend architecture powering the B.C. Colony Ganesh Utsav: robust relational Django models, atomic serializers, multi-channel n8n webhooks, and live SSE/WebSocket streaming endpoints.
        </p>
      </section>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-amber-500/25 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('models')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === 'models'
              ? 'bg-[#800000] text-amber-200 border border-amber-400'
              : 'text-amber-100/70 hover:text-amber-200 hover:bg-black/40'
          }`}
        >
          <Database className="w-4 h-4 text-amber-400" />
          <span>Django Models (models.py)</span>
        </button>

        <button
          onClick={() => setActiveTab('views')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === 'views'
              ? 'bg-[#800000] text-amber-200 border border-amber-400'
              : 'text-amber-100/70 hover:text-amber-200 hover:bg-black/40'
          }`}
        >
          <Code2 className="w-4 h-4 text-amber-400" />
          <span>DRF ViewSets (views.py)</span>
        </button>

        <button
          onClick={() => setActiveTab('n8n')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === 'n8n'
              ? 'bg-[#800000] text-amber-200 border border-amber-400'
              : 'text-amber-100/70 hover:text-amber-200 hover:bg-black/40'
          }`}
        >
          <Workflow className="w-4 h-4 text-amber-400" />
          <span>n8n Webhook Workflow (n8n.json)</span>
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === 'api'
              ? 'bg-[#800000] text-amber-200 border border-amber-400'
              : 'text-amber-100/70 hover:text-amber-200 hover:bg-black/40'
          }`}
        >
          <Terminal className="w-4 h-4 text-amber-400" />
          <span>Interactive API Tester</span>
        </button>
      </div>

      {/* TAB 1: DJANGO MODELS */}
      {activeTab === 'models' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-300">
              backend/festival/models.py • Python 3.11 + Django 5.0
            </span>
            <button
              onClick={() => copyCode(DJANGO_MODELS_CODE, 'models')}
              className="px-3 py-1.5 rounded-lg bg-black/50 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-black/80 flex items-center gap-1.5"
            >
              {copiedSection === 'models' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSection === 'models' ? 'Copied Code!' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="p-5 rounded-2xl bg-[#0d0707] border-2 border-amber-500/30 font-mono text-xs text-amber-100/90 overflow-x-auto leading-relaxed scrollbar-thin">
            {DJANGO_MODELS_CODE}
          </pre>
        </div>
      )}

      {/* TAB 2: DJANGO VIEWSETS */}
      {activeTab === 'views' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-300">
              backend/festival/views.py • Django REST Framework ViewSets
            </span>
            <button
              onClick={() => copyCode(DJANGO_VIEWS_CODE, 'views')}
              className="px-3 py-1.5 rounded-lg bg-black/50 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-black/80 flex items-center gap-1.5"
            >
              {copiedSection === 'views' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSection === 'views' ? 'Copied Code!' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="p-5 rounded-2xl bg-[#0d0707] border-2 border-amber-500/30 font-mono text-xs text-amber-100/90 overflow-x-auto leading-relaxed scrollbar-thin">
            {DJANGO_VIEWS_CODE}
          </pre>
        </div>
      )}

      {/* TAB 3: n8n WORKFLOW */}
      {activeTab === 'n8n' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-300">
              workflows/ganesh_utsav_broadcast.json • Importable in n8n
            </span>
            <button
              onClick={() => copyCode(N8N_WORKFLOW_CODE, 'n8n')}
              className="px-3 py-1.5 rounded-lg bg-black/50 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-black/80 flex items-center gap-1.5"
            >
              {copiedSection === 'n8n' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSection === 'n8n' ? 'Copied Workflow!' : 'Copy Workflow'}</span>
            </button>
          </div>
          <pre className="p-5 rounded-2xl bg-[#0d0707] border-2 border-amber-500/30 font-mono text-xs text-amber-100/90 overflow-x-auto leading-relaxed scrollbar-thin">
            {N8N_WORKFLOW_CODE}
          </pre>
        </div>
      )}

      {/* TAB 4: INTERACTIVE API TESTER */}
      {activeTab === 'api' && (
        <div className="rounded-3xl temple-glass p-6 sm:p-8 border-2 border-amber-500/30 space-y-6 shadow-2xl">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              REST Console
            </span>
            <h3 className="font-heading text-xl font-bold text-[#FFFDF5] mt-1">
              Live API Endpoint Explorer
            </h3>
            <p className="text-xs text-amber-200/70 mt-0.5">
              Execute live queries against the simulated Django REST endpoints.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <select
              value={selectedEndpoint}
              onChange={(e) => {
                setSelectedEndpoint(e.target.value);
                setApiResponse(null);
              }}
              className="w-full sm:w-auto flex-1 px-3 py-2.5 rounded-xl bg-black/70 border border-amber-500/30 text-amber-200 font-mono text-xs"
            >
              <option value="/api/v1/rituals/today/">GET /api/v1/rituals/today/</option>
              <option value="/api/v1/announcements/live/">GET /api/v1/announcements/live/</option>
              <option value="/api/v1/scoreboard/live/">GET /api/v1/scoreboard/live/</option>
              <option value="/api/v1/donations/verify/">GET /api/v1/donations/verify/</option>
            </select>

            <button
              onClick={handleTestEndpoint}
              disabled={isLoadingApi}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-heading font-bold text-xs hover:brightness-110 shadow-md border border-amber-300 flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>{isLoadingApi ? 'Querying...' : 'Send Request'}</span>
            </button>
          </div>

          {/* Response Box */}
          {apiResponse && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-green-400 font-bold">HTTP 200 OK</span>
                <span className="text-amber-200/60 font-mono">Content-Type: application/json</span>
              </div>
              <pre className="p-4 rounded-xl bg-black/80 border border-amber-500/30 font-mono text-xs text-amber-200 overflow-x-auto leading-relaxed">
                {apiResponse}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
