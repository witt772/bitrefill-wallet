'use client';

import React, { useState } from 'react';

// 仿真 Bitrefill 的货架商品
const BITREFILL_PRODUCTS = [
  { id: '1', name: 'Amazon 礼品卡', price: '$50.00', crypto: '50.00 USDT', icon: '🛒' },
  { id: '2', name: 'Apple App Store 充值卡', price: '$20.00', crypto: '20.00 USDT', icon: '🍎' },
  { id: '3', name: 'Steam 钱包充值卡', price: '$10.00', crypto: '10.00 USDT', icon: '🎮' },
  { id: '4', name: '全球旅行 eSIM 流量包', price: '$15.00', crypto: '15.00 USDT', icon: '🌐' },
];

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: '你好！我是您的 imToken 电商 AI 助手。我已经成功连接了 Bitrefill 商业网络，并集成了 token-core 钱包签名安全模块。你可以试着对我说：“帮我买一张 50U 的亚马逊卡” 或直接点击下方的快捷商品！' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isPendingPayment, setIsPendingPayment] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [txStatus, setTxStatus] = useState<'idle' | 'signing' | 'success'>('idle');
  const [walletCreated, setWalletCreated] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  // 1. 模拟 token-core 钱包创建逻辑
  const handleCreateWalletSimulation = () => {
    setIsCreatingWallet(true);
    setTimeout(() => {
      setWalletCreated(true);
      setIsCreatingWallet(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: '🔑 [token-core 成功派生] 已安全生成分层确定性(HD)钱包身份！测试助记词和 Keystore 已在沙盒环境中隔离加密保护。测试密码：123456 已生效。'
      }]);
    }, 1200);
  };

  // 2. 模拟 AI 意图解析 (Bitrefill Agents API 概念)
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    if (!textToSend) setInputValue('');
    const newMessages = [...messages, { role: 'user', text }];
    setMessages(newMessages);

    setTimeout(() => {
      if (text.includes('亚') || text.includes('Amazon') || text.includes('卡') || text.includes('🛒')) {
        const prod = BITREFILL_PRODUCTS[0];
        setCurrentOrder(prod);
        setMessages([...newMessages, 
          { role: 'assistant', text: `🤖 [Bitrefill Agent 解析成功] 已为您检索到商品：${prod.name}，官方定价：${prod.price}。` },
          { role: 'assistant', text: `🔒 [token-core 联动] 正在为您构建链上安全的转账交易负载（Payload）... 请检查右侧电子钱包进行确认签名。` }
        ]);
        setIsPendingPayment(true);
      } else {
        setMessages([...newMessages, { 
          role: 'assistant', 
          text: '🤖 收到您的指令！我可以通过 Bitrefill Agents API 帮您检索全球数码商品。您可以试着输入：“购买 Amazon 卡” 或者直接点击右侧商品卡片来体验完整的钱包电商购买和支付签名流。' 
        }]);
      }
    }, 800);
  };

  // 3. 模拟调用 token-core 的安全签名与广播
  const handleWalletSignSimulation = () => {
    setTxStatus('signing');
    setTimeout(() => {
      setTxStatus('success');
      setIsPendingPayment(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `🎉【电商消费成功】token-core 已成功签署并向区块链网络广播该笔消费交易！您的 Bitrefill 兑换卡密凭证已安全分发至您的钱包。`
      }]);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 md:p-6 selection:bg-teal-500 selection:text-slate-900">
      {/* 顶部导航 */}
      <header className="max-w-7xl mx-auto border-b border-slate-800 bg-slate-900/80 backdrop-blur rounded-2xl px-6 py-4 flex items-center justify-between mb-6 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-500 via-teal-400 to-emerald-400 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg">
            i
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wide flex items-center gap-2">
              imToken <span className="text-xs bg-slate-800 text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/20">10th AI 共创作品</span>
            </h1>
            <p className="text-xs text-slate-400">主题：让你的钱包成为电商助手 (Powered by Bitrefill & token-core)</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1 text-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-mono text-[11px]">Vercel 线上全功能沙盒</span>
        </div>
      </header>

      {/* 主体工作区 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 左侧面板：黑客松概念和设计阐述 */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5">
            <h2 className="font-semibold text-xs uppercase tracking-wider text-teal-400 mb-3">💡 核心叙事创意</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              传统钱包只是“资产保险箱”。本项目响应官方 <b>“让你的钱包成为电商助手”</b> 命题，通过将 <b>Bitrefill AI Agents</b> 作为全货架商业清算底层，叠加 <b>token-core</b> 强大的自托管密钥安全管理能力。用户只需一句话，AI 自动帮你选货，钱包一键签名完成支付，彻底打破 Web3 与传统商业消费的壁垒！
            </p>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="font-semibold text-xs uppercase tracking-wider text-teal-400">🛠️ 命题技术集成证明</h2>
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-xs font-mono text-emerald-400">1. Bitrefill AI Agents API</p>
                <p className="text-[11px] text-slate-400 mt-1">提供免 KYC、全球覆盖的数字商品清算网关，将法币供应链直接无缝注入 Web3 钱包生态。</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-xs font-mono text-blue-400">2. consenlabs/token-core</p>
                <p className="text-[11px] text-slate-400 mt-1">负责保护用户的 HD 钱包助记词身份、构建标准交易负载（Payload），并确保每一次电商消费签名的原子性与绝对安全性。</p>
              </div>
            </div>
          </div>
        </div>

        {/* 中间面板：AI 智能对话框 */}
        <div className="lg:col-span-5 flex flex-col h-[600px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-slate-900/50 p-4 border-b border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-2">
            <span className="bg-teal-500/10 text-teal-400 px-1.5 py-0.5 rounded text-[10px]">AI</span>
            Bitrefill 智能购物代理助手
          </div>

          {/* 消息历史 */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-teal-600 text-white rounded-tr-none' 
                    : 'bg-slate-900 border border-slate-800/80 text-slate-200 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* 输入框 */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/30 flex gap-2">
            <input
              type="text"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 text-slate-100 placeholder:text-slate-500"
              placeholder="我想买一张亚马逊礼品卡..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={() => handleSendMessage()}
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition-all text-xs"
            >
              发送
            </button>
          </div>
        </div>

        {/* 右侧面板：全仿真 imToken 手机钱包 */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* 快捷商品选择（加深 Bitrefill 氛围） */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">📦 快捷指令测试 (Bitrefill 货架)</h3>
            <div className="grid grid-cols-2 gap-2">
              {BITREFILL_PRODUCTS.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => handleSendMessage(`我要订购一张 ${p.name}`)}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer group"
                >
                  <span className="text-base group-hover:scale-110 inline-block transition-transform">{p.icon}</span>
                  <p className="text-[11px] font-medium text-slate-200 mt-1 truncate">{p.name}</p>
                  <p className="text-[10px] text-teal-400 font-mono">{p.crypto}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 手机壳容器 */}
          <div className="bg-slate-950 border-4 border-slate-800 rounded-[32px] p-4 shadow-2xl relative overflow-hidden h-[440px] flex flex-col justify-between">
            {/* 手机顶部条 */}
            <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono px-1">
              <span>09:41</span>
              <div className="w-16 h-3.5 bg-slate-800 rounded-b-xl absolute left-1/2 -translate-x-1/2 top-0" />
              <span>🔋 100%</span>
            </div>

            {/* 手机内部核心界面 */}
            <div className="mt-3 flex-1 flex flex-col justify-between">
              
              {/* 钱包身份绑定状态 */}
              <div>
                {!walletCreated ? (
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center space-y-2 my-2">
                    <p className="text-xs font-medium text-slate-300">🔒 发现未初始化 token-core 密钥环境</p>
                    <p className="text-[10px] text-slate-500">点击下方按钮模拟通过 `consenlabs/token-core` 派生安全 HD 钱包身份。</p>
                    <button
                      onClick={handleCreateWalletSimulation}
                      disabled={isCreatingWallet}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-teal-400 border border-teal-500/20 text-[11px] py-1.5 rounded-lg font-medium transition-colors"
                    >
                      {isCreatingWallet ? '正在派生加密密钥对...' : '✨ 一键初始化加密核心(token-core)'}
                    </button>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/20 flex items-center justify-between mb-3 animate-fadeIn">
                    <div>
                      <p className="text-[10px] text-emerald-400 font-medium">● token-core 运行中</p>
                      <p className="text-xs font-mono font-bold text-slate-200 mt-0.5">0x772...Bitrefill</p>
                    </div>
                    <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-400 font-mono">HD Wallet</span>
                  </div>
                )}

                {/* 状态 1：空闲状态 */}
                {!isPendingPayment && txStatus !== 'success' && (
                  <div className="text-center py-10 text-slate-500 space-y-2">
                    <div className="text-2xl">💤</div>
                    <p className="text-xs font-medium text-slate-400">等待 AI 电商代理触发交易</p>
                    <p className="text-[10px] px-2 text-slate-600">请在左侧输入“购买亚马逊卡”或直接点击上方的商品，AI 助手解析后将在此处自动唤起安全的硬核交易签名面板。</p>
                  </div>
                )}

                {/* 状态 2：唤起支付签名请求 */}
                {isPendingPayment && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-[11px]">
                      <p className="text-amber-400 font-semibold flex items-center gap-1">
                        ⚠️ 安全签名请求 [token-core-monorepo]
                      </p>
                      <p className="text-slate-300 mt-1">检测到上层 <b>Bitrefill Agent</b> 发起的数字商品安全结账负载：</p>
                    </div>

                    <div className="p-2.5 bg-slate-900 rounded-xl space-y-1.5 text-[10px] font-mono border border-slate-800">
                      <div className="flex justify-between"><span className="text-slate-500">交易规范:</span><span className="text-slate-300">EIP-712 / Digital Goods</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">网关结算商:</span><span className="text-teal-400 font-bold">Bitrefill Global</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">拟付清算资产:</span><span className="text-rose-400 font-bold font-sans text-xs">{currentOrder?.crypto}</span></div>
                    </div>
                  </div>
                )}

                {/* 状态 3：支付并签名成功 */}
                {txStatus === 'success' && (
                  <div className="text-center py-4 space-y-2 animate-scaleIn">
                    <div className="text-2xl">🏆</div>
                    <p className="text-xs font-bold text-emerald-400">签名并广播成功！</p>
                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-left font-mono text-[9px] text-slate-400 space-y-1">
                      <p className="text-slate-300 font-sans font-medium mb-1">🎁 Bitrefill 卡密已被安全认领并解密：</p>
                      <p className="text-emerald-400 bg-slate-950 p-1.5 rounded border border-emerald-500/10 break-all select-all">CLAIM_CODE: IM10TH-BITREFILL-MOCK-SUCCESS-0A89BBB</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 签名确认控制按钮 */}
              {isPendingPayment && (
                <button
                  onClick={handleWalletSignSimulation}
                  disabled={txStatus === 'signing'}
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold py-2 rounded-xl transition-all text-xs active:scale-95 shadow-md shadow-teal-500/10"
                >
                  {txStatus === 'signing' ? '🔄 正在调用安全硬件环境生成签名...' : '✍️ 确认生物识别并授权安全签名'}
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
