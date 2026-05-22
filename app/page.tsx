'use client';

import React, { useState } from 'react';
import init, * as tcx from '@consenlabs/tcx-wasm';

export default function BitrefillWalletAssistant() {
  const [step, setStep] = useState<'home' | 'wallet'>('home');
  const [keystore, setKeystore] = useState('');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const createWallet = async () => {
    setLoading(true);
    try {
      setStatus('正在加载 Token Core WASM...');
      await init();

      const ks = tcx.create_keystore(JSON.stringify({
        password: "123456",
        mnemonic: "",
        network: "MAINNET"
      }));

      setKeystore(ks);
      setStep('wallet');
      setStatus('钱包创建成功');
      alert('✅ 测试钱包已创建！密码：123456\n\n请勿在真实环境中使用此 Demo！');
    } catch (err: any) {
      alert('创建失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deriveAddresses = async () => {
    if (!keystore) return;
    setLoading(true);
    try {
      await init();
      const result = tcx.derive_accounts(JSON.stringify({
        keystoreJson: keystore,
        key: "123456",
        derivations: [
          { chain: "ETHEREUM", derivationPath: "m/44'/60'/0'/0/0" },
          { chain: "BITCOIN", derivationPath: "m/84'/0'/0'/0/0", segWit: "VERSION_0" },
          { chain: "TRON", derivationPath: "m/44'/195'/0'/0/0" },
        ]
      }));

      setAddresses(JSON.parse(result));
      setStatus('地址派生成功');
    } catch (err: any) {
      alert('派生失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openBitrefill = () => window.open('https://www.bitrefill.com/', '_blank');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center text-xl">🛍️</div>
            <div>
              <div className="font-semibold text-xl">Bitrefill Assistant</div>
              <div className="text-xs text-emerald-400">Powered by Token Core</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">imToken 10th Anniversary</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {step === 'home' && (
          <div className="text-center pt-20">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl flex items-center justify-center text-6xl mb-8">
              🛒
            </div>
            <h1 className="text-5xl font-bold mb-4">让你的钱包<br />成为电商助手</h1>
            <p className="text-xl text-gray-400 mb-12 max-w-md mx-auto">
              使用官方 tcx-wasm 构建 • 一键连接 Bitrefill
            </p>

            <button 
              onClick={createWallet}
              disabled={loading}
              className="w-full max-w-sm mx-auto bg-white text-black font-bold text-2xl py-8 rounded-3xl hover:bg-gray-200 transition disabled:opacity-70"
            >
              {loading ? '加载中...' : '🚀 创建测试钱包'}
            </button>

            <p className="mt-8 text-sm text-gray-500">测试密码：123456</p>
          </div>
        )}

        {step === 'wallet' && (
          <div className="space-y-8">
            {/* Wallet Card */}
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-emerald-400 text-sm">YOUR WALLET</div>
                  <div className="text-2xl font-semibold mt-1">已就绪</div>
                </div>
                <div className="text-4xl">🔐</div>
              </div>

              <button 
                onClick={deriveAddresses}
                disabled={loading}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-4 rounded-2xl text-lg font-medium transition"
              >
                {loading ? '派生中...' : '显示多链地址'}
              </button>

              {addresses.length > 0 && (
                <div className="mt-6 space-y-4">
                  {addresses.map((acc, i) => (
                    <div key={i} className="bg-black/50 p-5 rounded-2xl border border-white/10">
                      <div className="text-emerald-400 text-sm mb-1">{acc.chain}</div>
                      <div className="font-mono text-sm break-all">{acc.address}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bitrefill Section */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-3xl p-8">
              <h2 className="text-3xl font-semibold mb-3">🛍️ Bitrefill 电商助手</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                在自托管钱包内直接购买礼品卡、手机充值、eSIM、游戏点卡等<br />
                无需 KYC • 全球即时到账
              </p>

              <button 
                onClick={openBitrefill}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-bold text-2xl py-8 rounded-3xl transition"
              >
                立即前往 Bitrefill 购物
              </button>
            </div>

            <div className="text-center text-xs text-gray-500 pt-8">
              Token Core tcx-wasm • 本 Demo 仅供 Hackathon 展示 • 请使用测试数据
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
