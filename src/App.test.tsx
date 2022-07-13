import { ReactNode } from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import App from "./App";
import CoinsProvider from "./providers/CoinsProvider";
import ErrorProvider from "./providers/ErrorProvider";
import userEvent from "@testing-library/user-event";
import { Asset } from "./core/Asset";

import { coinsFixture, priceFixture } from "./test/fixtures";

// set up server to mock request for get-coins
const server = setupServer(
  rest.get("/.netlify/functions/get-coins", async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(coinsFixture));
  }),
  rest.get(".netlify/functions/get-coin-price", async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(priceFixture));
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

test("should update accounts and trade history on exchange", async () => {
  // render the app
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <ErrorProvider>
      <CoinsProvider>{children}</CoinsProvider>
    </ErrorProvider>
  );

  render(<App />, { wrapper: Wrapper });

  // Assert get-coins works
  await waitForElementToBeRemoved(() => screen.queryByTestId(/loading/i));
  const coins = await screen.findAllByTestId(/coin/i);
  expect(coins.length).toEqual(coinsFixture.data.length);

  // Assert one accounts exist
  const accounts = await screen.findAllByTestId(/account/i);
  expect(accounts.length).toEqual(1);

  //Submit form
  await userEvent.selectOptions(screen.getByLabelText("From:"), [Asset.USD]);
  await userEvent.selectOptions(screen.getByLabelText("To:"), [Asset.BTC]);
  await userEvent.type(screen.getByLabelText("Amount:"), "0.01");
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  // wait for exchange to complete
  await waitForElementToBeRemoved(() => screen.queryByTestId(/exchanging/i));

  // Assert added to accounts
  const newAccounts = await screen.findAllByTestId(/account/i);
  expect(newAccounts.length).toEqual(2);

  // Assert added to trade history
  const trades = await screen.findAllByTestId(/trade/i);
  expect(trades.length).toEqual(1);
});
