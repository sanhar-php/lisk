/* eslint-disable mocha/no-pending-tests */
/*
 * Copyright © 2018 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 */

'use strict';

var rewire = require('rewire');
var transactionTypes = require('../../../helpers/transaction_types.js');

var MultisignaturesModule = rewire('../../../modules/multisignatures.js');

describe('multisignatures', () => {
	describe('constructor', () => {
		let library;
		let loggerStub;
		let dbStub;
		let networkStub;
		let schemaStub;
		let edStub;
		let busStub;
		let balancesSequenceStub;
		let transactionStub;
		let accountStub;
		let error;
		let multisignatureModuleInstance;
		let multisignatureModuleSelf;
		let __private;

		beforeEach(done => {
			dbStub = {
				query: sinonSandbox.spy(),
			};

			loggerStub = {
				debug: sinonSandbox.spy(),
				error: sinonSandbox.spy(),
			};

			busStub = {};
			schemaStub = {};
			networkStub = {};
			balancesSequenceStub = {
				add: () => {},
			};

			transactionStub = {
				attachAssetType: sinonSandbox.stub().returns('attachAssetTypeResponse'),
			};

			accountStub = {};

			multisignatureModuleInstance = new MultisignaturesModule(
				(err, multisignatureModule) => {
					error = err;
					multisignatureModuleSelf = multisignatureModule;
					library = MultisignaturesModule.__get__('library');
					__private = MultisignaturesModule.__get__('__private');
					done();
				},
				{
					logic: {
						transaction: transactionStub,
						account: accountStub,
					},
					db: dbStub,
					logger: loggerStub,
					bus: busStub,
					schema: schemaStub,
					network: networkStub,
					balancesSequence: balancesSequenceStub,
				}
			);
		});

		describe('library', () => {
			it('should assign logger', () => {
				return expect(library)
					.to.have.property('logger')
					.which.is.equal(loggerStub);
			});

			it('should assign db', () => {
				return expect(library)
					.to.have.property('db')
					.which.is.equal(dbStub);
			});

			it('should assign network', () => {
				return expect(library)
					.to.have.property('network')
					.which.is.equal(networkStub);
			});

			it('should assign schema', () => {
				return expect(library)
					.to.have.property('schema')
					.which.is.equal(schemaStub);
			});

			it('should assign ed', () => {
				return expect(library)
					.to.have.property('ed')
					.which.is.equal(edStub);
			});

			it('should assign bus', () => {
				return expect(library)
					.to.have.property('bus')
					.which.is.equal(busStub);
			});

			it('should assign balancesSequence', () => {
				return expect(library)
					.to.have.property('balancesSequence')
					.which.is.equal(balancesSequenceStub);
			});

			it('should assign logic.transaction', () => {
				return expect(library)
					.to.have.nested.property('logic.transaction')
					.which.is.equal(transactionStub);
			});

			it('should assign logic.account', () => {
				return expect(library)
					.to.have.nested.property('logic.account')
					.which.is.equal(accountStub);
			});
		});

		describe('__private', () => {
			it('should call library.logic.transaction.attachAssetType', () => {
				return expect(library.logic.transaction.attachAssetType.called).to.be
					.true;
			});

			it('assign __private.assetTypes[transactionTypes.MULTI]', () => {
				return expect(__private.assetTypes)
					.to.have.property(transactionTypes.MULTI)
					.which.is.equal('attachAssetTypeResponse');
			});
		});

		it('should return error = null', () => {
			return expect(error).to.equal(null);
		});

		it('should return Multisignature instance', () => {
			return expect(multisignatureModuleInstance).to.equal(
				multisignatureModuleSelf
			);
		});
	});

	describe('processSignature', () => {
		function continueSignatureProcessing() {
			it('should call library.balancesSequence.add');

			it('should call modules.transactions.getMultisignatureTransaction');

			it(
				'should call modules.transactions.getMultisignatureTransaction with transaction.transaction'
			);

			describe('when multisignature transaction.transaction does not exist', () => {
				it('should call callback with error = "Transaction not found"');
			});

			describe('when multisignature transaction.transaction exists', () => {
				it('should call modules.accounts.getAccount');

				it(
					'should call modules.accounts.getAccount with {address: transaction.senderId}'
				);

				describe('when modules.accounts.getAccount fails', () => {
					it('should call callback with error');
				});

				describe('when modules.accounts.getAccount succeeds', () => {
					describe('when sender does not exist', () => {
						it('should call callback with error = "Sender not found"');
					});

					describe('when sender exists', () => {
						it('should call Multisignature.prototype.ready');

						it(
							'should call Multisignature.prototype.ready with multisignature with signatures containing transaction.signature'
						);

						it('should call Multisignature.prototype.ready with sender');

						it('should call library.bus.message');

						it('should call library.bus.message with "signature"');

						it(
							'should call library.bus.message with {transaction: transaction.transaction, signature: transaction.signature}'
						);

						it('should call library.bus.message with true');

						it('should call callback with error = undefined');

						it('should call callback with result = undefined');
					});
				});
			});
		}

		describe('when no transaction passed', () => {
			it(
				'should call callback with error = "Unable to process signature. Signature is undefined."'
			);
		});

		describe('when transaction passed', () => {
			it('should call modules.transactions.getMultisignatureTransaction');

			it(
				'should call modules.transactions.getMultisignatureTransaction with transaction.transaction'
			);

			describe('when multisignature transaction.transaction does not exist', () => {
				it('should call callback with error = "Transaction not found"');
			});

			describe('when multisignature transaction.transaction exists', () => {
				describe('when transaction type != transactionTypes.MULTI', () => {
					it('should call modules.accounts.getAccount');

					it(
						'should call modules.accounts.getAccount with {address: transaction.senderId}'
					);

					describe('when modules.accounts.getAccount fails', () => {
						it(
							'should call callback with error = "Multisignature account not found"'
						);
					});

					describe('when modules.accounts.getAccount succeeds', () => {
						describe('when account does not exist', () => {
							it(
								'should call callback with error = "Account account not found"'
							);
						});

						describe('when account exists', () => {
							describe('when multisignature already contains transaction.signature', () => {
								it(
									'should call callback with error = "Signature already exists"'
								);
							});

							describe('for every account.multisignatures', () => {
								it('should call library.logic.transaction.verifySignature');

								it(
									'should call library.logic.transaction.verifySignature with multisignature'
								);

								it(
									'should call library.logic.transaction.verifySignature with account.multisignatures'
								);

								it(
									'should call library.logic.transaction.verifySignature with transaction.signature'
								);

								describe('when library.logic.transaction.verifySignature throws', () => {
									it('should call library.logger.error');

									it('should call library.logger.error with error stack');

									it(
										'should call callback with error = "Failed to verify signature"'
									);
								});

								describe('when library.logic.transaction.verifySignature returns false', () => {
									it(
										'should call callback with error = "Failed to verify signature"'
									);
								});

								describe('when library.logic.transaction.verifySignature returns true', () => {
									continueSignatureProcessing();
								});
							});
						});
					});
				});

				describe('when multisignature transaction type = transactionTypes.MULTI', () => {
					describe('when multisignature is already signed', () => {
						it(
							'should call callback with error = "Permission to sign transaction denied"'
						);
					});

					describe('when multisignature already contains transaction.signature', () => {
						it(
							'should call callback with error = "Permission to sign transaction denied"'
						);
					});

					describe('for every multisignature keysgroup member', () => {
						it('should call library.logic.transaction.verifySignature');

						it(
							'should call library.logic.transaction.verifySignature with multisignature'
						);

						it(
							'should call library.logic.transaction.verifySignature with keysgroup member'
						);

						it(
							'should call library.logic.transaction.verifySignature with transaction.signature'
						);

						describe('when library.logic.transaction.verifySignature throws', () => {
							it('should call library.logger.error');

							it('should call library.logger.error with error stack');

							it(
								'should call callback with error = "Failed to verify signature"'
							);
						});

						describe('when library.logic.transaction.verifySignature returns false', () => {
							it(
								'should call callback with error = "Failed to verify signature"'
							);
						});

						describe('when library.logic.transaction.verifySignature returns true', () => {
							continueSignatureProcessing();
						});
					});
				});
			});
		});
	});

	describe('getGroup', () => {
		it('should accept address as parameter');

		it('should fail if wrong address is provided');

		it('should fail if valid address but not a multisig account');

		it('should return a group if provided with a valid multisig account');
	});

	describe('isLoaded', () => {
		it('should return true if modules exists');

		it('should return true if modules does not exist');
	});

	describe('onBind', () => {
		describe('modules', () => {
			it('should assign accounts');

			it('should assign transactions');
		});

		describe('assetTypes', () => {
			it('should call bind on multisignature logic with scope.accounts');
		});
	});

	describe('shared', () => {
		describe('getGroups', () => {
			it('should accept fitlers.address parameter');

			describe('when schema validation fails', () => {
				it('should call callback with schema error');
			});

			describe('when schema validation succeeds', () => {
				it('should call library.db.one');

				it('should call library.db.one with sql.getAccountIds');

				it('should call library.db.one with { publicKey: req.body.publicKey }');

				describe('when library.db.one fails', () => {
					it('should call the logger.error with error stack');

					it('should call callback with "Multisignature#getAccountIds error"');
				});

				describe('when library.db.one succeeds', () => {
					it('should call modules.accounts.getAccounts');

					it(
						'should call modules.accounts.getAccounts with {address: {$in: scope.accountIds}, sort: "balance"}'
					);

					it(
						'should call modules.accounts.getAccounts with ["address", "balance", "multisignatures", "multilifetime", "multimin"]'
					);

					describe('when modules.accounts.getAccounts fails', () => {
						it('should call callback with error');
					});

					describe('when modules.accounts.getAccounts succeeds', () => {
						describe('for every account', () => {
							describe('for every account.multisignature', () => {
								it('should call modules.accounts.generateAddressByPublicKey');

								it(
									'should call modules.accounts.generateAddressByPublicKey with multisignature'
								);
							});

							it('should call modules.accounts.getAccounts');

							it(
								'should call modules.accounts.getAccounts with {address: { $in: addresses }'
							);

							it(
								'should call modules.accounts.getAccounts with ["address", "publicKey", "balance"]'
							);

							describe('when modules.accounts.getAccounts fails', () => {
								it('should call callback with error');
							});

							describe('when modules.accounts.getAccounts succeeds', () => {
								it('should call callback with error = null');

								it('should call callback with result containing accounts');
							});
						});
					});
				});
			});
		});

		describe('getMemberships', () => {
			it('should accept fitlers.address parameter');

			describe('when schema validation fails', () => {
				it('should call callback with schema error');
			});

			describe('when schema validation succeeds', () => {
				it('should call library.db.one');

				it('should call library.db.one with sql.getAccountIds');

				it('should call library.db.one with { publicKey: req.body.publicKey }');

				describe('when library.db.one fails', () => {
					it('should call the logger.error with error stack');

					it('should call callback with "Multisignature#getAccountIds error"');
				});

				describe('when library.db.one succeeds', () => {
					it('should call modules.accounts.getAccounts');

					it(
						'should call modules.accounts.getAccounts with {address: {$in: scope.accountIds}, sort: "balance"}'
					);

					it(
						'should call modules.accounts.getAccounts with ["address", "balance", "multisignatures", "multilifetime", "multimin"]'
					);

					describe('when modules.accounts.getAccounts fails', () => {
						it('should call callback with error');
					});

					describe('when modules.accounts.getAccounts succeeds', () => {
						describe('for every account', () => {
							describe('for every account.multisignature', () => {
								it('should call modules.accounts.generateAddressByPublicKey');

								it(
									'should call modules.accounts.generateAddressByPublicKey with multisignature'
								);
							});

							it('should call modules.accounts.getAccounts');

							it(
								'should call modules.accounts.getAccounts with {address: { $in: addresses }'
							);

							it(
								'should call modules.accounts.getAccounts with ["address", "publicKey", "balance"]'
							);

							describe('when modules.accounts.getAccounts fails', () => {
								it('should call callback with error');
							});

							describe('when modules.accounts.getAccounts succeeds', () => {
								it('should call callback with error = null');

								it('should call callback with result containing accounts');
							});
						});
					});
				});
			});
		});
	});
});
