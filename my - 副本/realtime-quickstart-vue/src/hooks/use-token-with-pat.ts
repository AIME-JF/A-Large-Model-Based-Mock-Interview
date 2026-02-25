const useTokenWithPat = () => {
  const getToken = () => {
    // 请替换为您的有效PAT token
    // 获取方式：登录 https://coze.cn -> 开发者模式 -> API密钥 -> 创建新的PAT token
    const token = 'cztei_q1Ppd63BCcEtp7DNGekloAmdoObyCYagl77ewmIsJCO5ObTrLsWHBLDqC6c00ci9e';
    
    if (!token || token.length < 10) {
      throw new Error('PAT token未配置或无效，请在 src/hooks/use-token-with-pat.ts 中配置有效的token');
    }
    
    return token;
  };
  
  return {
    getToken,
  };
};

export { useTokenWithPat };
