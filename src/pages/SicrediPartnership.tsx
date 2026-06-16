import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Logo } from '@/components/ui/logo'
import {
  ArrowDown,
  CheckCircle2,
  CreditCard,
  Shield,
  Banknote,
  BrainCircuit,
  Zap,
  BarChart3,
  MessageSquare,
  Globe,
  TrendingUp,
  MapPin,
  FileCheck,
  Rocket,
} from 'lucide-react'

function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function SicrediPartnership() {
  const WHATSAPP_NUMBER = '5511999999999'
  const MSG_CREDIT = encodeURIComponent(
    'Olá! Tenho interesse na parceria AgroIA X Sicredi para crédito rural. Pode me ajudar?',
  )
  const MSG_INSURANCE = encodeURIComponent(
    'Olá! Tenho interesse em seguros rurais pela parceria AgroIA X Sicredi.',
  )
  const MSG_CONSULTING = encodeURIComponent(
    'Olá! Gostaria de agendar uma consultoria sobre a parceria AgroIA X Sicredi.',
  )

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#00C853] selection:text-black">
      <SEO
        title="AgroIA × Sicredi — Crédito Rural e IA para o Agronegócio Brasileiro"
        description="A maior cooperativa de crédito do Brasil unida à IA do campo. Acesse crédito rural, seguros e gestão inteligente com AgroIA e Sicredi."
      />
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-gradient-to-b from-[#0A1F0D] to-[#0D2B10]">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none mix-blend-overlay" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#0A1F0D]/60 text-[#D4AF37] text-sm font-semibold mb-8 tracking-wide shadow-lg shadow-[#D4AF37]/5">
              ✦ Parceria Estratégica 2025
            </div>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-10">
              <span className="text-5xl md:text-7xl font-black text-white tracking-tight">
                AGRO<span className="text-[#00C853]">IA</span>
              </span>
              <span className="text-4xl md:text-6xl font-light text-[#D4AF37]">×</span>
              <span className="text-5xl md:text-7xl font-black text-[#009959] tracking-tight">
                Sicredi
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={300}>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-5xl mx-auto leading-[1.1]">
              Agro IA × Sicredi:{' '}
              <span className="text-[#00C853] font-medium block mt-2">
                Inovação e Cooperação para o Agronegócio do Futuro
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-emerald-100/70 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              A maior cooperativa de crédito do Brasil unida à inteligência artificial do campo.
              Acesse crédito rural, seguros e gestão inteligente de forma rápida e baseada em dados.
            </p>
          </FadeIn>

          <FadeIn delay={450}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#detalhes" className="w-full sm:w-auto">
                <Button className="bg-[#00C853] hover:bg-[#009959] text-black font-bold px-8 py-7 text-lg rounded-full w-full sm:w-auto shadow-lg shadow-[#00C853]/20 transition-all hover:scale-105">
                  Conheça a Parceria <ArrowDown className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <Link to="/planos" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 font-bold px-8 py-7 text-lg rounded-full w-full sm:w-auto bg-transparent backdrop-blur-sm transition-all"
                >
                  Ver Planos da AgroIA
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Synergy Comparison Section */}
      <section id="detalhes" className="py-24 bg-[#0A0F0D] relative border-t border-[#00C853]/10">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                A Força de Duas Gigantes
              </h2>
              <p className="text-[#00C853] text-xl font-medium max-w-2xl mx-auto">
                Juntos, entregamos o que nenhum banco ou startup consegue sozinho.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <FadeIn delay={100}>
              <Card className="bg-[#0A1F0D]/40 border-[#00C853]/50 border-t-4 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(0,200,83,0.3)] transition-all duration-300">
                <CardContent className="p-8 md:p-10">
                  <div className="w-16 h-16 rounded-2xl bg-[#00C853]/10 flex items-center justify-center mb-8 border border-[#00C853]/20">
                    <BrainCircuit className="w-8 h-8 text-[#00C853]" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">AgroIA</h3>
                  <ul className="space-y-4">
                    {[
                      '9 módulos avançados de Inteligência Artificial',
                      'Diagnóstico de pragas em 30 segundos',
                      'Monitoramento via Satélite em tempo real',
                      'Consultor IA Agrícola disponível 24/7',
                      'Previsões de preços e tendências de mercado',
                    ].map((text, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-4 text-zinc-300 text-lg leading-relaxed"
                      >
                        <CheckCircle2 className="w-6 h-6 text-[#00C853] shrink-0 mt-0.5" />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={200}>
              <Card className="bg-[#0D2B10]/40 border-[#009959]/50 border-t-4 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(0,153,89,0.3)] transition-all duration-300">
                <CardContent className="p-8 md:p-10">
                  <div className="w-16 h-16 rounded-2xl bg-[#009959]/10 flex items-center justify-center mb-8 border border-[#009959]/20">
                    <Banknote className="w-8 h-8 text-[#009959]" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">Sicredi</h3>
                  <ul className="space-y-4">
                    {[
                      'Maior cooperativa de crédito do Brasil',
                      'Taxas justas e crédito facilitado',
                      'Seguro rural completo e acessível',
                      'Participação nos resultados da cooperativa',
                      'Forte atuação no desenvolvimento regional',
                    ].map((text, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-4 text-zinc-300 text-lg leading-relaxed"
                      >
                        <CheckCircle2 className="w-6 h-6 text-[#009959] shrink-0 mt-0.5" />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 bg-[#111A13] border-y border-[#00C853]/10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: CreditCard, title: 'Crédito Facilitado', color: 'text-emerald-400' },
              { icon: Shield, title: 'Proteção Abrangente', color: 'text-blue-400' },
              { icon: BarChart3, title: 'Decisões por Dados', color: 'text-purple-400' },
              { icon: TrendingUp, title: 'Maior Rentabilidade', color: 'text-[#00C853]' },
              { icon: Globe, title: 'Comunidade Fortalecida', color: 'text-[#009959]' },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-black/40 border border-zinc-800/50 p-6 rounded-2xl flex flex-col items-center text-center hover:bg-black/60 transition-colors h-full">
                  <div className={`p-4 rounded-full bg-zinc-900/80 mb-4 ${item.color}`}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold text-lg text-white">{item.title}</h4>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Rural Credit Details */}
      <section className="py-24 bg-white text-zinc-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <FadeIn>
            <div className="flex items-center gap-5 mb-12 border-b pb-6">
              <div className="p-4 bg-[#009959]/10 rounded-2xl">
                <Banknote className="w-10 h-10 text-[#009959]" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
                  Crédito Rural Descomplicado
                </h2>
                <p className="text-zinc-500 mt-2 text-lg">
                  Impulsione sua produção com recursos sob medida.
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
              {[
                {
                  title: 'Custeio Agrícola',
                  desc: 'Recursos para sementes, fertilizantes e insumos essenciais.',
                },
                {
                  title: 'Investimento',
                  desc: 'Aquisição de maquinário, tecnologia e melhorias estruturais.',
                },
                {
                  title: 'Comercialização',
                  desc: 'Apoio para a melhor janela de venda da sua safra.',
                },
                {
                  title: 'Compra de Terras',
                  desc: 'Expansão segura com linhas de crédito especializadas.',
                },
              ].map((card, i) => (
                <FadeIn key={i} delay={i * 100}>
                  <div className="bg-zinc-50 p-6 rounded-2xl border-l-4 border-[#009959] hover:shadow-md transition-shadow h-full">
                    <h4 className="text-xl font-bold text-zinc-900 mb-2">{card.title}</h4>
                    <p className="text-zinc-600">{card.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={400}>
              <div className="bg-[#E8F5E9] p-8 rounded-2xl border-l-4 border-[#00C853] flex flex-col justify-center h-full shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <BrainCircuit className="w-32 h-32" />
                </div>
                <Zap className="w-10 h-10 text-[#00C853] mb-6 relative z-10" />
                <h4 className="text-2xl font-black text-zinc-900 mb-4 relative z-10">
                  Aprovações mais rápidas com IA
                </h4>
                <p className="text-zinc-700 text-lg leading-relaxed relative z-10">
                  Com os dados de ROI, previsões de safra e relatórios climáticos gerados pela
                  AgroIA, a análise do seu crédito pelo Sicredi ganha velocidade e precisão,
                  destravando recursos no momento exato.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Rural Insurance Details */}
      <section className="py-24 bg-[#F0FFF4] text-zinc-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <FadeIn>
            <div className="flex items-center gap-5 mb-12 border-b border-[#009959]/20 pb-6">
              <div className="p-4 bg-[#00C853]/10 rounded-2xl">
                <Shield className="w-10 h-10 text-[#00C853]" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
                  Segurança para Sua Produção
                </h2>
                <p className="text-zinc-600 mt-2 text-lg">
                  Proteja seu patrimônio contra imprevistos.
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={100} className="md:col-start-1 md:col-end-2 order-last md:order-first">
              <div className="bg-white p-8 rounded-2xl border-l-4 border-[#009959] flex flex-col justify-center h-full shadow-md relative overflow-hidden">
                <div className="absolute bottom-0 left-0 p-4 opacity-5">
                  <Shield className="w-32 h-32" />
                </div>
                <BrainCircuit className="w-10 h-10 text-[#009959] mb-6 relative z-10" />
                <h4 className="text-2xl font-black text-zinc-900 mb-4 relative z-10">
                  Gestão Proativa
                </h4>
                <p className="text-zinc-700 text-lg leading-relaxed relative z-10">
                  Os alertas climáticos e de pragas da AgroIA permitem acionar seguros de forma
                  antecipada ou comprovar sinistros com laudos validados por IA, reduzindo
                  burocracia.
                </p>
              </div>
            </FadeIn>

            <div className="md:col-span-2 grid sm:grid-cols-2 gap-6 order-first md:order-last">
              {[
                {
                  title: 'Seguro Agrícola',
                  desc: 'Cobertura contra eventos climáticos extremos e variações bruscas.',
                },
                {
                  title: 'Seguro Pecuário',
                  desc: 'Proteção para seu rebanho contra doenças e acidentes.',
                },
                {
                  title: 'Seguro de Máquinas',
                  desc: 'Seu parque de tratores e colheitadeiras totalmente resguardado.',
                },
                {
                  title: 'Seguro de Benfeitorias',
                  desc: 'Galpões, silos e estruturas protegidos de ponta a ponta.',
                },
              ].map((card, i) => (
                <FadeIn key={i} delay={i * 100 + 200}>
                  <div className="bg-white p-6 rounded-2xl border-l-4 border-[#00C853] hover:shadow-md transition-shadow h-full">
                    <h4 className="text-xl font-bold text-zinc-900 mb-2">{card.title}</h4>
                    <p className="text-zinc-600">{card.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Integrated Management Section */}
      <section className="py-24 bg-white text-zinc-900 border-t border-zinc-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="inline-block p-4 bg-zinc-100 rounded-2xl mb-6">
                <BarChart3 className="w-10 h-10 text-zinc-800" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight mb-4">
                Gestão Financeira Inteligente
              </h2>
              <p className="text-zinc-500 text-xl max-w-2xl mx-auto">
                A combinação perfeita entre Tecnologia de ponta e Cooperativismo financeiro.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: 'Planejamento Financeiro',
                desc: 'Integre o painel financeiro da AgroIA diretamente com suas contas Sicredi para um fluxo de caixa impecável.',
              },
              {
                icon: BrainCircuit,
                title: 'Decisões por Dados',
                desc: 'Saiba o momento exato de comprar insumos ou vender sua safra com análises de mercado baseadas em IA.',
              },
              {
                icon: Users,
                title: 'Desenvolvimento Regional',
                desc: 'Ao crescer com tecnologia, você fortalece o cooperativismo e traz mais prosperidade para sua região.',
              },
            ].map((card, i) => (
              <FadeIn key={i} delay={i * 150}>
                <div className="bg-zinc-50 p-8 rounded-3xl text-center hover:bg-zinc-100 transition-colors h-full flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm">
                    <card.icon className="w-8 h-8 text-[#009959]" />
                  </div>
                  <h4 className="text-2xl font-bold text-zinc-900 mb-4">{card.title}</h4>
                  <p className="text-zinc-600 leading-relaxed">{card.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Practical Steps Section */}
      <section className="py-32 bg-[#0A0F0D] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#00C853]/5 to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-black text-white text-center mb-20 tracking-tight">
              Como funciona na prática?
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-12 relative mb-24">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-[#00C853]/30 to-transparent -z-10" />

            {[
              {
                num: '01',
                icon: MapPin,
                text: 'Monitore sua propriedade com a plataforma AgroIA.',
              },
              {
                num: '02',
                icon: FileCheck,
                text: 'Gere relatórios de saúde da safra validados por IA.',
              },
              { num: '03', icon: Rocket, text: 'Apresente ao Sicredi e obtenha aprovação rápida.' },
            ].map((step, i) => (
              <FadeIn key={i} delay={i * 200}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-[#111A13] border-4 border-[#00C853]/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,200,83,0.15)] relative">
                    <step.icon className="w-10 h-10 text-[#00C853]" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#009959] flex items-center justify-center text-sm font-bold text-white shadow-lg">
                      {step.num}
                    </div>
                  </div>
                  <p className="text-xl text-zinc-300 font-medium leading-relaxed max-w-xs">
                    {step.text}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={600}>
            <div className="bg-gradient-to-r from-[#00C853]/10 to-[#009959]/10 p-10 md:p-14 rounded-3xl border border-[#00C853]/20 text-center max-w-4xl mx-auto backdrop-blur-sm">
              <QuoteIcon className="w-12 h-12 text-[#00C853]/40 mx-auto mb-6" />
              <h3 className="text-2xl md:text-4xl font-light text-white leading-tight italic">
                "Não é só uma parceria de marca. É uma{' '}
                <strong className="text-[#00C853] font-bold">integração real</strong> que entrega
                resultado tangível para o produtor rural na ponta."
              </h3>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Final CTAs (WhatsApp Integration) */}
      <section className="py-32 bg-gradient-to-br from-[#1B5E20] to-[#0A2E10] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')] opacity-10 pointer-events-none mix-blend-overlay" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Pronto para transformar sua fazenda?
              </h2>
              <p className="text-emerald-100 text-xl max-w-2xl mx-auto">
                Fale com nossos especialistas via WhatsApp agora mesmo e descubra as vantagens.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { title: 'Otimizar Crédito Rural', msg: MSG_CREDIT, icon: Banknote },
              { title: 'Proteger Minha Produção', msg: MSG_INSURANCE, icon: Shield },
              { title: 'Falar com Especialista', msg: MSG_CONSULTING, icon: MessageSquare },
            ].map((cta, i) => (
              <FadeIn key={i} delay={i * 150}>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${cta.msg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl hover:bg-white/20 hover:border-white/40 transition-all duration-300 text-center h-full">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <cta.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{cta.title}</h3>
                    <p className="text-emerald-100/70 text-sm">Clique para enviar mensagem →</p>
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={600}>
            <div className="text-center">
              <Link to="/planos">
                <Button className="bg-white text-[#1B5E20] hover:bg-zinc-100 font-black px-10 py-8 text-xl rounded-full shadow-2xl transition-all hover:scale-105">
                  Conheça os Planos da Agro IA →
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Partnership Footer */}
      <footer className="py-16 bg-[#070D09] border-t border-[#00C853]/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Logo />
              <div className="hidden sm:block w-px h-8 bg-[#D4AF37]/50" />
              <span className="text-2xl font-black text-[#009959] tracking-tight">Sicredi</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link
                to="/dashboard"
                className="text-zinc-400 hover:text-[#00C853] transition-colors font-medium"
              >
                Acessar Plataforma AgroIA
              </Link>
              <Link
                to="/planos"
                className="text-zinc-400 hover:text-[#00C853] transition-colors font-medium"
              >
                Ver Planos
              </Link>
            </div>
          </div>

          <div className="text-center border-t border-white/5 pt-8">
            <p className="text-zinc-600 text-sm">
              © {new Date().getFullYear()} AgroIA e Sicredi. Todos os direitos reservados. Esta é
              uma landing page de parceria estratégica.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function QuoteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  )
}
