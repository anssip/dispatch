import { Container } from 'overstated'; 

const R = require('ramda');

class ContextContainer extends Container {
  constructor(ctx = {}, vars) {
    super();
    this.state = { isModified: false, ctx: ctx || {}, vars: vars || [], selectedEnv: null };
  }

  init(ctx, vars) {
    this.setState({ 
      isModified: false, 
      ctx: ctx || {}, 
      vars: vars || [], 
      selectedEnv: null 
    });
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


  selectEnv(selectedEnv) {
    console.log(`selecting environment ${selectedEnv}`);
    this.setState({ isModified: true, selectedEnv });
    return this;
  }

  getEnvs() {
    const allValues = R.flatten(R.map(R.prop("values"), this.state.vars));
    return R.uniq(R.map(R.prop("env"), allValues));
  }

  getEnvironment(env) {    
    // TODO: maybe convert to Ramda
    return this.getVariables().map(v => ({ name: v.name, value: v.values.find(v => v.env == env).value }));
  }

  getSelectedEnv() {
    return this.state.selectEnv;
  }

  getNamePlaceholder() {
    if (! (this.state && this.state.envs)) return 'Default';
    // @ts-ignore
    const oldWithNum = this.state.envs.reverse().find(r => r.name.indexOf('environment-') >= 0);
    return oldWithNum ? `environment-${Number(oldWithNum.name.split('environment-')[1]) + 1}` : 'environment-0';
  }

  addNewEnvironment(name = this.getNamePlaceholder()) {
    const newVariables = this.getVariables().map(v => ({ ...v, values: [ ...v.values, { env: name, value: null } ] }));
    this.setState({ isModified: true, vars: newVariables })
    return newVariables;
  }

  setVariable(env, name, value) {
    const variable = R.find(R.propEq("name", name), this.getVariables());
    const newVariables = variable ? 
      this.getVariables().map(v => v.name == name ? { name: variable.name, values: variable.values.map(v => v.env == env ? { env, value} : v) } : v) : 
      [ ...this.getVariables(), this.createNewVariable(env, name, value) ];

    this.setState({ isModified: true, vars: newVariables })
    return newVariables;
  }

  addEmptyVariable(name) {
    const variable = R.find(R.propEq("name", name), this.getVariables());
    if (variable) return variable;
    const newVariables = [ ...this.getVariables(), { name, values: []}];
    this.setState({ isModified: true, vars: newVariables });
    return newVariables;
  }

  createNewVariable(env, name, value) {
    return { name, values: [{ env, value }]};
  }

  getVariables() {
    return this.state.vars;
  }

  getVariable(env, name) {
    const variable = R.find(R.propEq("name", name), this.getVariables());
    if (! variable) return null;
    const value = R.find(R.propEq("env", env), variable.values);
    if (! value) return null;
    return value.value;
  }

  setEnvironmentName(oldName, name) {
    console.log(`setEnvironmentName: ${name}`);
    // TODO: convert below to use R ??
    const newVariables = this.getVariables().map(v => ({ ...v, values: [ v.values.map(v => v.env == oldName ? { ...v, env: name } : v) ] }));
    this.setState({ isModified: true, vars: newVariables });
    return newVariables;
  }
}

export default new ContextContainer();