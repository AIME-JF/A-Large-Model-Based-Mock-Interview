const useTokenWithPat = () => {
  const getToken = () => {
    const token = process.env.VUE_APP_COZE_PAT || '';
    
    if (!token || token.length < 10) {
      throw new Error('PAT token未配置或无效，请配置 VUE_APP_COZE_PAT 环境变量');
    }
    
    return token;
  };
  
  return {
    getToken,
  };
};

export { useTokenWithPat };
