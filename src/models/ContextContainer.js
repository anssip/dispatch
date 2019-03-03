import { Container } from 'overstated'; 
import { getPublishConfigsForUpdateInfo } from 'app-builder-lib/out/publish/PublishManager';

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

  getNamePlaceholder(prefix = 'environment-') {
    if (! (this.state && this.state.envs)) return 'Default';
    // @ts-ignore
    const oldWithNum = this.state.envs.reverse().find(r => r.name.indexOf(prefix) >= 0);
    return oldWithNum ? prefix + Number(oldWithNum.name.split(prefix)[1]) + 1 : `${prefix}-0`;
  }

  addNewEnvironment(name = this.getNamePlaceholder()) {
    const newVariables = this.getVariables().map(v => ({ ...v, values: [ ...v.values, { env: name, value: null } ] }));
    this.setState({ isModified: true, vars: newVariables })
    return newVariables;
  }

  addOrUpdateVariable(env, existingVar, name, value) {
    const newVariables = existingVar ? 
      this.getVariables().map(v => v.name == name ? 
        { 
          name: existingVar.name, 
          values: existingVar.values.find(v => v.env == env) ? existingVar.values.map(v => v.env == env ? { env, value } : v) : [ ...existingVar.values, { env, value } ]
        } : v) : 
      [ ...this.getVariables(), this.createNewVariable(env, name, value) ];

    this.setState({ isModified: true, vars: newVariables })
    return newVariables;
  }

  setVariable(env, name, value) {
    const variable = R.find(R.propEq("name", name), this.getVariables());
    return this.addOrUpdateVariable(env, variable, name, value);
  }

  setVariableAt(env, i, props) {
    const existingVar = this.getVariables()[i];
    if (! existingVar) return null;

    console.log(`setVariableAt() updating variable at index ${i}: ${JSON.stringify(existingVar)}`);

    // TODO: remove duplication with addOrUpdateVariable()
    const newVariables = this.getVariables().map((v, index) => index == i ? 
      { 
        name: props.name || existingVar.name, 
        values: existingVar.values.find(v => v.env == env) ? existingVar.values.map(v => v.env == env ? { env, value: props.value || v.value } : v) : [ ...existingVar.values, { env, value: props.value } ]
      } : v );
    this.setState({ isModified: true, vars: newVariables })
    return newVariables;
  }

  addEmptyVariable(name = '') {
    // const variable = R.find(R.propEq("name", name), this.getVariables());
    // if (variable) return variable;
    const newVar = { name, values: []};
    const newVariables = [ ...this.getVariables(), newVar];
    this.setState({ isModified: true, vars: newVariables });
    return newVariables;
  }

  createNewVariable(env, name, value) {
    return { name, values: [{ env, value }]};
  }

  getVariables() {
    return this.state.vars;
  }

  getVariableByName(env, name) {
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