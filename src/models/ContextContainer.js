import { Container } from 'overstated'; 

const R = require('ramda');

class ContextContainer extends Container {
  constructor(ctx = {}, envs = []) {
    super();
    this.state = { isModified: false, ctx, envs };
  }

  init(ctx, envs) {
    this.setState({ isModified: false, ctx, envs});
  }

  getValue() {
    return this.state.ctx;
  }

  setValue(value) {
    this.setState({ isModified: true, ctx: value});
  }

  reset() {
    this.setState({ isModified: false, ctx: null });
  }

  isModified() {
    return this.state.isModified;
  }

  setModified(isModified) {
    this.setState({ isModified });
  }

  cloneNonSelected(env) {
    if (! env) throw new Error('Environment not specified');
    const newEnv = R.clone(env);
    newEnv.selected = false;
    return newEnv;
  }

  selectEnv(index) {
    console.log(`selecting environment ${index}`);
    const env = this.cloneNonSelected(this.state.envs[index]);
    env.selected = true;
    const newEnvs = R.map(this.cloneNonSelected, this.state.envs);
    this.setState({ 
      envs: newEnvs.map((r, i) => i === index ? env : r)
    });
  }

  getEnvs() {
    return this.state.envs;
  }

  getSelectedEnv() {
    console.log('getSelected');
    if (this.getEnvs().length === 0) return {};
    return R.find(R.prop('selected'))(this.getEnvs());
  }

  getNamePlaceholder() {
    // @ts-ignore
    const oldWithNum = this.state.envs.reverse().find(r => r.name.indexOf('environment-') >= 0);
    return oldWithNum ? `request-${Number(oldWithNum.name.split('environment-')[1]) + 1}` : 'environment-0';
  }
  
  createEmptyEnvironment() {
    return {
      name: this.getNamePlaceholder(),
      variables: []
    };
  }

  addEnvironment(env) {
    this.setState({ isModified: true, envs: [... R.map(this.cloneNonSelected, this.state.envs || []), env] });
  }

  addNewEnvironment() {
    this.addEnvironment(this.createEmptyEnvironment());
  }

  findVariable(env, name) {
    return R.find(R.propEq('name', name))(env.variables || []);
  } 

  replaceEnv(env) {
    const envs = this.state.envs.map(e => e.name == env.name ? env : e);
    this.setState({ isModified: true, envs });
    return envs; 
  }

  addNewVariable(name, value) {
    const env = this.getSelectedEnv();
    if (! env) throw new Error("Environment not selected");
    env.variables = [ ...env.variables, { name, value } ];
    return this.replaceEnv(env);
  }

  setVariable(index, name, value) {
    const env = this.getSelectedEnv();
    if (! env) throw new Error("Environment not selected");
    if (index > env.variables.length) throw new Error(`Invalid index for a new env variable: ${index}`);
    
    const newVars = R.map(R.clone, env.variables).map((v, i) => i == index ? { name, value } : v);
    const newEnv = { 
      name: env.name, 
      variables: newVars 
    };
    return this.replaceEnv(newEnv);
  }

}

export default new ContextContainer();