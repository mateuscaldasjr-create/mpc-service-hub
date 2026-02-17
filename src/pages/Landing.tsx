
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Cpu, 
  Zap, 
  Battery, 
  Wind, 
  Wrench, 
  Truck, 
  Network,
  ShieldCheck,
  BarChart3,
  Clock
} from 'lucide-react';

const Landing: React.FC = () => {
  const services = [
    { title: 'Geradores', icon: Battery, desc: 'Manutenção preventiva e corretiva em grupos geradores.' },
    { title: 'Subestações', icon: Zap, desc: 'Adequação, manutenção e operação de subestações de alta tensão.' },
    { title: 'Nobreaks', icon: Cpu, desc: 'Sistemas críticos de energia ininterrupta para data centers.' },
    { title: 'Informática', icon: Network, desc: 'Infraestrutura de rede e suporte a hardware corporativo.' },
    { title: 'Refrigeração', icon: Wind, desc: 'Sistemas de ar condicionado central e chillers industriais.' },
    { title: 'Engenharia', icon: Wrench, desc: 'Projetos e laudos técnicos especializados.' },
    { title: 'Transporte', icon: Truck, desc: 'Logística de cargas rodoviárias pesadas e sensíveis.' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">M</div>
            <span className="text-xl font-bold tracking-tight">MPC <span className="text-blue-500">SERVICE HUB</span></span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-400">
            <a href="#about" className="hover:text-white transition-colors">Sobre</a>
            <a href="#services" className="hover:text-white transition-colors">Serviços</a>
            <a href="#contact" className="hover:text-white transition-colors">Contato</a>
            <Link to="/login" className="bg-zinc-100 text-zinc-950 px-5 py-2.5 rounded-full hover:bg-white transition-all shadow-lg shadow-white/5">
              Acessar Sistema
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            <span>Tecnologia em Infraestrutura</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Soluções Técnicas Profissionais para <span className="text-zinc-500">Infraestruturas Críticas</span>
          </h1>
          <p className="mt-8 text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            A MPC oferece serviços especializados em manutenção técnica, engenharia e suporte operacional com rastreabilidade completa e controle total através do MPC Service Hub.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/login" className="group w-full sm:w-auto bg-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-500 transition-all flex items-center justify-center shadow-xl shadow-blue-900/20">
              Começar agora
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#services" className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-zinc-300 hover:text-white hover:bg-zinc-900 transition-all">
              Ver serviços
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-y border-zinc-900 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Contratos Ativos', val: '150+' },
            { label: 'Atendimentos/Ano', val: '12k+' },
            { label: 'Disponibilidade', val: '99.9%' },
            { label: 'Técnicos Especialistas', val: '45+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stat.val}</div>
              <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-4">Especialidades MPC</h2>
            <div className="h-1.5 w-20 bg-blue-600 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((svc) => (
              <div key={svc.title} className="group p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:bg-zinc-900 hover:border-zinc-700 transition-all">
                <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svc.icon className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">{svc.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features / Service Hub */}
      <section className="py-32 px-6 bg-gradient-to-b from-zinc-950 to-zinc-900">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-bold leading-tight mb-8">
              Gestão Digital Completa com o <br/>
              <span className="text-blue-500">MPC Service Hub</span>
            </h2>
            <div className="space-y-6">
              {[
                { icon: ShieldCheck, title: 'Rastreabilidade Total', desc: 'Acompanhe cada etapa do seu chamado técnico em tempo real.' },
                { icon: Clock, title: 'Atendimento 24/7', desc: 'Sistemas automatizados para abertura de chamados críticos a qualquer momento.' },
                { icon: BarChart3, title: 'Indicadores de Performance', desc: 'Dashboards completos com SLA, MTBF e MTTR da sua infraestrutura.' },
              ].map((f) => (
                <div key={f.title} className="flex space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                    <f.icon className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{f.title}</h4>
                    <p className="text-zinc-400 text-sm">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="absolute -inset-4 bg-blue-500/20 blur-3xl opacity-20"></div>
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-2xl">
              <img src="https://picsum.photos/seed/dash/1200/800" alt="Dashboard Preview" className="rounded-xl opacity-90" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-20 px-6 border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">M</div>
              <span className="text-xl font-bold">MPC SERVICE HUB</span>
            </div>
            <p className="text-zinc-500 max-w-sm">
              MPC Comércio e Serviços LTDA. <br/>
              Liderança em soluções técnicas para empresas que não podem parar.
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-6">Acesso Rápido</h5>
            <ul className="space-y-4 text-zinc-500 text-sm">
              <li><Link to="/login" className="hover:text-blue-500">Login no Sistema</Link></li>
              <li><a href="#" className="hover:text-blue-500">Portal do Cliente</a></li>
              <li><a href="#" className="hover:text-blue-500">Trabalhe Conosco</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6">Contato</h5>
            <ul className="space-y-4 text-zinc-500 text-sm">
              <li>contato@mpcservicos.com.br</li>
              <li>+55 (00) 0000-0000</li>
              <li>São Paulo, Brasil</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-900 text-zinc-600 text-xs flex flex-col md:flex-row justify-between items-center">
          <p>© 2024 MPC Comércio e Serviços LTDA. Todos os direitos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-zinc-400">Termos de Uso</a>
            <a href="#" className="hover:text-zinc-400">Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
