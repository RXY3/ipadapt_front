export default {
  'POST /api/login/account': (req: any, res: any) => {
    const { password, username } = req.body;
    if (username === 'admin' && password === 'ant.design') {
      res.send({
        status: 'ok',
        type: 'account',
        currentAuthority: 'admin',
        token: 'mock-token-admin',
      });
      return;
    }
    if (username === 'user' && password === 'ant.design') {
      res.send({
        status: 'ok',
        type: 'account',
        currentAuthority: 'user',
        token: 'mock-token-user',
      });
      return;
    }
    res.send({
      status: 'error',
      type: 'account',
      currentAuthority: 'guest',
    });
  },

  'POST /api/register': (req: any, res: any) => {
    const { username } = req.body;
    res.send({
      status: 'ok',
      currentAuthority: 'user',
      token: 'mock-token-' + username,
    });
  },
};
