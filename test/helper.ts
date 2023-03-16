import { server as App } from "./../src";

export function build() {
  beforeAll(async () => {
    await App.ready();
  }, 10000);

  afterAll(() => App.close());

  return App;
}
