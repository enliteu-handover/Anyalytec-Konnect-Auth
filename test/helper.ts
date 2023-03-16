import { server as App } from "./../src";

export function build() {
  beforeAll(async () => {
    await App.ready();
  });

  afterAll(() => App.close());

  return App;
}
