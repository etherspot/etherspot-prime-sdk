#!/usr/bin/env node
import { Command } from "commander";
import address from "./address";
import transfer from "./transfer";
import erc20Transfer from "./erc20Transfer";
import erc20Approve from "./erc20Approve";
import batchErc20Transfer from "./batchErc20Transfer";
import nftTransfer from './NFTTransfer';

const program = new Command();

program
  .name("ERC-4337 Etherspot Implementation")
  .description(
    "A collection of example scripts for working with ERC-4337 Etherspot Implementation"
  )
  .version("0.1.0");

program
  .command("address")
  .description("Generate a counterfactual address.")
  .action(address);

program
  .command("transfer")
  .description("Transfer ETH")
  .requiredOption("-t, --to <address>", "The recipient address")
  .requiredOption("-amt, --amount <eth>", "Amount in ETH to transfer")
  .action(async (opts) =>
    transfer(opts.to, opts.amount)
  );

program
  .command("erc20Transfer")
  .description("Transfer ERC-20 token")
  .requiredOption("-tkn, --token <address>", "The token address")
  .requiredOption("-t, --to <address>", "The recipient address")
  .requiredOption("-amt, --amount <decimal>", "Amount of the token to transfer")
  .action(async (opts) =>
    erc20Transfer(opts.token, opts.to, opts.amount)
  );

program
  .command("erc20Approve")
  .description("Approve spender for ERC-20 token")
  .requiredOption("-tkn, --token <address>", "The token address")
  .requiredOption("-s, --spender <address>", "The spender address")
  .requiredOption("-amt, --amount <decimal>", "Amount of the token to transfer")
  .action(async (opts) =>
    erc20Approve(opts.token, opts.spender, opts.amount)
  );

program
  .command("batchErc20Transfer")
  .description("Batch transfer ERC-20 token")
  .requiredOption("-tkn, --token <address>", "The token address")
  .requiredOption(
    "-t, --to <addresses>",
    "Comma separated list of recipient addresses"
  )
  .requiredOption("-amt, --amount <decimal>", "Amount of the token to transfer")
  .action(async (opts) =>
    batchErc20Transfer(opts.token, opts.to.split(","), opts.amount)
  );

program
  .command("NFTTransfer")
  .description("Transfer ERC-721 token")
  .requiredOption("-tkn, --token <address>", "The token address")
  .requiredOption("-t, --to <address>", "The recipient address")
  .requiredOption("-tknid, --tokenId <number>", "tokenId of the NFT to transfer")
  .action(async (opts) =>
    nftTransfer(opts.token, opts.to, opts.tokenId)
  );

program.parse();
