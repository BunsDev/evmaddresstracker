// @ts-nocheck
import { SyncOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from 'antd';
import { utils } from 'ethers';
import React, { useEffect, useState } from 'react';

import { Address, Balance } from '../components';

export default function ExampleUI({
  purpose,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [newAddress, setNewAddress] = useState('');
  const [addressList, setAddressList] = useState([]);

  useEffect(() => {
    if (localStorage?.getItem('evmAT')) {
      setAddressList(localStorage.getItem('evmAT'));
    }
  }, [addressList, address]);

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: '1px solid #cccccc', padding: 16, width: 400, margin: 'auto', marginTop: 64 }}>
        <h2>Add Address:</h2>
        <Divider />
        <div style={{ margin: 8 }}>
          <Input
            onChange={e => {
              setNewAddress(e.target.value);
            }}
          />
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              if (localStorage?.getItem('evmAT')) {
                const oldPayload = JSON.parse(localStorage.getItem('evmAT'));
                const payload = { address: [...oldPayload[address], newAddress] };
                localStorage.setItem('evmAT', JSON.stringify(payload));
              } else {
                const payload = { address: [newAddress] };
                localStorage.setItem('evmAT', JSON.stringify(payload));
              }
              console.log('newAddress', newAddress);
            }}
          >
            Add Address
          </Button>
        </div>
        <Divider />
        <h2>Remove Address:</h2>
        <Divider />
        <Divider />
        <h2>Edit Address:</h2>
        <Divider />
        <Divider />
        <h2>View All Addresses:</h2>
        <Divider />
        {JSON.stringify(addressList)}
        <Divider />
      </div>

      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: '1px solid #cccccc', padding: 16, width: 400, margin: 'auto', marginTop: 64 }}>
        <h2>Example UI:</h2>
        <h4>purpose: {purpose}</h4>
        <Divider />
        <Divider />
        Your Address:
        <Address address={address} ensProvider={mainnetProvider} fontSize={16} />
        <Divider />
        ENS Address Example:
        <Address
          address="0x34aA3F359A9D614239015126635CE7732c18fDF3" /* this will show as austingriffith.eth */
          ensProvider={mainnetProvider}
          fontSize={16}
        />
        <Divider />
        {/* use utils.formatEther to display a BigNumber: */}
        <h2>Your Balance: {yourLocalBalance ? utils.formatEther(yourLocalBalance) : '...'}</h2>
        <div>OR</div>
        <Balance address={address} provider={localProvider} price={price} />
        <Divider />
        <div>🐳 Example Whale Balance:</div>
        <Balance balance={utils.parseEther('1000')} provider={localProvider} price={price} />
        <Divider />
        {/* use utils.formatEther to display a BigNumber: */}
        <h2>Your Balance: {yourLocalBalance ? utils.formatEther(yourLocalBalance) : '...'}</h2>
        <Divider />
        Your Contract Address:
        <Address
          address={readContracts && readContracts.YourContract ? readContracts.YourContract.address : null}
          ensProvider={mainnetProvider}
          fontSize={16}
        />
        <Divider />
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /* look how you call setPurpose on your contract: */
              tx(writeContracts.YourContract.setPurpose('🍻 Cheers'));
            }}
          >
            Set Purpose to &quot;🍻 Cheers&quot;
          </Button>
        </div>
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /*
              you can also just craft a transaction and send it to the tx() transactor
              here we are sending value straight to the contract's address:
            */
              tx({
                to: writeContracts.YourContract.address,
                value: utils.parseEther('0.001'),
              });
              /* this should throw an error about "no fallback nor receive function" until you add it */
            }}
          >
            Send Value
          </Button>
        </div>
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /* look how we call setPurpose AND send some value along */
              tx(
                writeContracts.YourContract.setPurpose('💵 Paying for this one!', {
                  value: utils.parseEther('0.001'),
                }),
              );
              /* this will fail until you make the setPurpose function payable */
            }}
          >
            Set Purpose With Value
          </Button>
        </div>
        <div style={{ margin: 8 }}>
          <Button
            onClick={() => {
              /* you can also just craft a transaction and send it to the tx() transactor */
              tx({
                to: writeContracts.YourContract.address,
                value: utils.parseEther('0.001'),
                data: writeContracts.YourContract.interface.encodeFunctionData('setPurpose(string)', [
                  '🤓 Whoa so 1337!',
                ]),
              });
              /* this should throw an error about "no fallback nor receive function" until you add it */
            }}
          >
            Another Example
          </Button>
        </div>
      </div>

      <div style={{ width: 600, margin: 'auto', marginTop: 32, paddingBottom: 256 }}>
        <Card style={{ marginTop: 32 }}>
          <div>
            There are tons of generic components included from{' '}
            <a href="https://ant.design/components/overview/" target="_blank" rel="noopener noreferrer">
              🐜 ant.design
            </a>{' '}
            too!
          </div>

          <div style={{ marginTop: 8 }}>
            <Button type="primary">Buttons</Button>
          </div>

          <div style={{ marginTop: 8 }}>
            <SyncOutlined spin /> Icons
          </div>

          <div style={{ marginTop: 8 }}>
            Date Pickers?
            <div style={{ marginTop: 2 }}>
              <DatePicker onChange={() => {}} />
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <Slider range defaultValue={[20, 50]} onChange={() => {}} />
          </div>

          <div style={{ marginTop: 32 }}>
            <Switch defaultChecked onChange={() => {}} />
          </div>

          <div style={{ marginTop: 32 }}>
            <Progress percent={50} status="active" />
          </div>

          <div style={{ marginTop: 32 }}>
            <Spin />
          </div>
        </Card>
      </div>
    </div>
  );
}
