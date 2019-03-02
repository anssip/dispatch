import { Container } from 'overstated'; 

const R = require('ramda');

class ContextContainer extends Container {
  constructor(ctx = {}, envs) {
    super();
    this.state = { isModified: false, ctx, envs: envs || [this.createEmptyEnvironment()] };
  }

  init(ctx, envs) {
    this.setState({ isModified: false, ctx: ctx || {}, envs: envs || [this.createEmptyEnvironment()] });
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
    return this;
  }

  getEnvs() {
    return this.state.envs;
  }

  getSelectedEnv() {
    console.log('getSelected', this.getEnvs());
    if (this.getEnvs().length === 0) return this.createEmptyEnvironment();
    const selected = R.find(R.prop('selected'))(this.getEnvs());
    return selected || this.getEnvs()[0];
  }

  getNamePlaceholder() {
    if (! (this.state && this.state.envs)) return 'Default';
    // @ts-ignore
    const oldWithNum = this.state.envs.reverse().find(r => r.name.indexOf('environment-') >= 0);
    return oldWithNum ? `request-${Number(oldWithNum.name.split('environment-')[1]) + 1}` : 'environment-0';
  }
  
  createEmptyEnvironment() {
    return {
      name: this.getNamePlaceholder(),
      variables: [ { name: '', value: ''} ]
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

  getVariable(index) {
    const env = this.getSelectedEnv();
    if (! env) throw new Error("Environment not selected");
    return env.variables[index];
  }

  setVariable(index, props) {
    const env = this.getSelectedEnv();
    if (! env) throw new Error("Environment not selected");
    if (index > env.variables.length) throw new Error(`Invalid index for a new env variable: ${index}`);
    
    const newVars = R.map(R.clone, env.variables).map((v, i) => i == index ? { ...v, ...props } : v);
    const newEnv = { 
      name: env.name, 
      selected: true,
      variables: newVars 
    };
    return this.replaceEnv(newEnv);
  }

}

export default new ContextContainer();