'use client';

import React, { useState } from 'react';
import init, * as tcx from '@consenlabs/tcx-wasm';

export default function BitrefillWallet() {
  const [step, setStep] = useState<'home' | 'wallet'>('home');
  const [mnemonic, setMnemonic] = useState('');
  const [keystore, setKeystore] = useState('');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 随机生成助记词 + 创建钱包（使用 Token Core）
  const createRandomWallet = async () => {
    setLoading(true);
    try {
      await init();  // 初始化 tcx-wasm

      // Token Core 官方方式：随机生成助记词
      const result = tcx.create_keystore(JSON.stringify({
        password: "123456",           // 测试密码
        mnemonic: "",                 // 留空 = Token Core 自动随机生成
        network: "MAINNET"
      }));

      const ks = JSON.parse(result);
      const generatedMnemonic = ks.mnemonic || "未能获取助记词";

      setKeystore(result);
      setMnemonic(generatedMnemonic);
      setStep('wallet');

      alert(`✅ 随机助记词已生成！\n\n请立即备份下面助记词（非常重要！）\n\n${generatedMnemonic}\n\n测试密码: 123456`);
    } catch (err: any) {
      alert('生成失败: ' + err.message);
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
    } catch (err: any) {
      alert('派生地址失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openBitrefill = () => window.open('https://www.bitrefill.com/', '_blank');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {step === 'home' && (
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">🛍️ Bitrefill Wallet Assistant</h1>
            <p className="text-xl text-gray-400 mb-12">使用官方 Token Core tcx-wasm 构建</p>
            
            <button 
              onClick={createRandomWallet}
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-2xl px-16 py-8 rounded-3xl transition"
            >
              {loading ? '生成中...' : '🚀 随机生成新钱包'}
            </button>
          </div>
        )}

        {step === 'wallet' && (
          <div className="space-y-8">
            <div className="bg-zinc-900 p-8 rounded-3xl border border-emerald-500/30">
              <h2 className="text-2xl font-bold mb-6 text-emerald-400">✅ 钱包创建成功（Token Core）</h2>
              
              <div className="bg-black p-6 rounded-2xl mb-6">
                <p className="text-sm text-gray-400 mb-3">你的助记词（请立即备份！）</p>
                <p className="font-mono text-orange-400 leading-relaxed break-words">{mnemonic}</p>
              </div>

              <button 
                onClick={deriveAddresses}
                disabled={loading}
                className="w-full bg-white/10 hover:bg-white/20 py-4 rounded-2xl mb-6"
              >
                {loading ? '派生中...' : '显示 ETH / BTC / TRON 地址'}
              </button>

              {addresses.length > 0 && (
                <div className="space-y-4">
                  {addresses.map((a, i) => (
                    <div key={i} className="bg-zinc-950 p-4 rounded-xl font-mono text-sm">
                      <span className="text-emerald-400">{a.chain}：</span> {a.address}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-8 rounded-3xl text-center">
              <button 
                onClick={openBitrefill}
                className="text-black font-bold text-2xl py-6 px-16 rounded-3xl hover:scale-105 transition"
              >
                🛒 去 Bitrefill 购物
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
