// @ts-nocheck
import { Button, Divider, Input } from 'antd';
import { utils } from 'ethers';
import React, { useEffect, useState } from 'react';

import { AddressListDisplay, Balance } from '../components';

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
  const [editStates, setEditStates] = useState({});

  useEffect(() => {
    if (localStorage?.getItem('evmAT')) {
      const result = localStorage.getItem('evmAT') ? JSON.parse(localStorage.getItem('evmAT')) : null;
      console.log('result', result);
      if (result) {
        setAddressList(result[address]);
      }
    }
  }, []);

  // useEffect(() => {
  //   if (localStorage?.getItem('evmAT')) {
  //     const result = localStorage.getItem('evmAT') ? JSON.parse(localStorage.getItem('evmAT')) : null;
  //     if (result) {
  //       setAddressList(result[address]);
  //     }
  //   }
  // }, [address, addressList]);

  // Toggle edit state
  const toggleEdit = address => {
    setEditStates({
      ...editStates,
      [address]: !editStates[address],
    });
  };

  //remove address from address list
  const removeAddress = address => {
    console.log('removeAddress', address);
    const oldPayload = JSON.parse(localStorage.getItem('evmAT'));
    const payload = oldPayload.address.filter(item => item !== address) || [];
    localStorage.setItem('evmAT', JSON.stringify(payload));
    setAddressList(oldPayload.address.filter(item => item !== address));
  };

  //edit address from address list
  const editAddress = (address, newAddress) => {
    console.log('editAddress', address, newAddress);
    const oldPayload = JSON.parse(localStorage.getItem('evmAT'));
    const payload = oldPayload.address.map(item => (item === address ? newAddress : item));
    localStorage.setItem('evmAT', JSON.stringify(payload));
    setAddressList(oldPayload.address.map(item => (item === address ? newAddress : item)));
  };

  return (
    <div>
      <h2 className="text-xl text-center font-medium text-gray-900 dark:text-white">EVM Address Tracker</h2>
      <div style={{ border: '1px solid #cccccc', padding: 16, width: 400, margin: 'auto', marginTop: 30 }}>
        <h2>Add Address:</h2>
        <Divider />
        <div style={{ margin: 8 }}>
          <Input
            value={newAddress}
            onChange={e => {
              setNewAddress(e.target.value);
              // clear input after
              if (addressList.includes(newAddress)) {
                setNewAddress('');
              }
            }}
          />
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              // verify address is not already added
              if (addressList.includes(newAddress)) {
                alert('Address already added');
                setNewAddress('');
                return;
              }
              // verify valid ethereum address
              if (!utils.isAddress(newAddress)) {
                alert('Invalid Ethereum Address');
                return;
              }

              // Add Address
              if (localStorage?.getItem('evmAT')) {
                const oldPayload = JSON.parse(localStorage.getItem('evmAT'));
                console.log('view old payload ', oldPayload[address]);
                oldPayload[address] = [...oldPayload[address], newAddress];
                localStorage.setItem('evmAT', JSON.stringify(oldPayload));
                setAddressList([...newAddress, addressList]);
                setNewAddress('');
              } else {
                const newItem = {};
                newItem[address] = [newAddress];
                localStorage.setItem('evmAT', JSON.stringify(newItem));
                setAddressList([newAddress]);
                setNewAddress('');
              }
              console.log('newAddress', newAddress);
            }}
          >
            Add Address
          </Button>
        </div>
        <Divider />
        <h2>View All Addresses:</h2>
        <Divider />
        {addressList && addressList.length > 0 ? (
          addressList.map((address, index) => {
            return (
              address && (
                <div className="text-black" key={index}>
                  <AddressListDisplay address={address} ensProvider={mainnetProvider} fontSize={16} />
                  <Balance address={address} provider={mainnetProvider} price={price} />
                  ETH
                  <Button
                    style={{ marginTop: 8 }}
                    onClick={() => {
                      removeAddress(address);
                    }}
                  >
                    Remove
                  </Button>
                  <>
                    <Button onClick={() => toggleEdit(address)}>Edit</Button>
                    <Input value={address} hidden={!editStates[address]} />
                    <Button
                      onClick={() => {
                        editAddress(address, newAddress);
                      }}
                      hidden={!editStates[address]}
                    >
                      Save Edit
                    </Button>
                  </>
                  <Divider />
                </div>
              )
            );
          })
        ) : (
          <p>No Addresses Added</p>
        )}
        <Divider />
      </div>
    </div>
  );
}
