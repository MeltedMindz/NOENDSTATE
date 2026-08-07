// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {ChronicleRegistry} from "../src/ChronicleRegistry.sol";
import {ProjectRegistry} from "../src/ProjectRegistry.sol";

contract ChronicleRegistryTest is Test {
    ChronicleRegistry reg;
    address admin = makeAddr("admin");
    address recorder = makeAddr("recorder");
    address rando = makeAddr("rando");

    function setUp() public {
        reg = new ChronicleRegistry(admin);
        bytes32 role = reg.RECORDER_ROLE();
        vm.prank(admin);
        reg.grantRole(role, recorder);
    }

    function test_appendAssignsDenseSequences() public {
        vm.startPrank(recorder);
        uint64 a = reg.append(0, keccak256("a"), bytes32(0), 1, reg.NO_SUPERSEDES(), "ipfs://a");
        uint64 b = reg.append(1, keccak256("b"), bytes32(0), 2, reg.NO_SUPERSEDES(), "ipfs://b");
        vm.stopPrank();
        assertEq(a, 0);
        assertEq(b, 1);
        assertEq(reg.nextSequence(), 2);
    }

    function test_recordsAreImmutableOnceWritten() public {
        uint64 none = reg.NO_SUPERSEDES();
        vm.prank(recorder);
        reg.append(3, keccak256("x"), bytes32("P-000"), 100, none, "u");
        ChronicleRegistry.Record memory r = reg.record(0);
        assertEq(r.contentHash, keccak256("x"));
        assertEq(r.projectId, bytes32("P-000"));
        assertEq(r.occurredAt, 100);
        // No mutation surface exists; appending more never changes record 0.
        vm.prank(recorder);
        reg.append(4, keccak256("y"), bytes32(0), 200, none, "v");
        ChronicleRegistry.Record memory again = reg.record(0);
        assertEq(again.contentHash, keccak256("x"));
    }

    function test_supersedeMustReferenceExistingRecord() public {
        vm.startPrank(recorder);
        vm.expectRevert(ChronicleRegistry.SupersedesUnknown.selector);
        reg.append(20, keccak256("c"), bytes32(0), 1, 5, "u");
        reg.append(0, keccak256("a"), bytes32(0), 1, reg.NO_SUPERSEDES(), "u");
        uint64 corr = reg.append(20, keccak256("c"), bytes32(0), 1, 0, "u");
        vm.stopPrank();
        // Superseded record remains readable.
        assertEq(reg.record(0).contentHash, keccak256("a"));
        assertEq(reg.record(corr).supersedes, 0);
    }

    function test_rootEvolvesWithEveryAppend() public {
        bytes32 r0 = reg.root();
        uint64 none = reg.NO_SUPERSEDES();
        vm.prank(recorder);
        reg.append(0, keccak256("a"), bytes32(0), 1, none, "u");
        bytes32 r1 = reg.root();
        assertTrue(r0 != r1);
        assertEq(r1, keccak256(abi.encodePacked(r0, keccak256("a"))));
    }

    function test_onlyRecorderAppends() public {
        vm.prank(rando);
        vm.expectRevert();
        reg.append(0, keccak256("a"), bytes32(0), 1, type(uint64).max, "u");
    }

    function test_missingRecordReverts() public {
        vm.expectRevert(ChronicleRegistry.RecordMissing.selector);
        reg.record(0);
    }
}

contract ProjectRegistryTest is Test {
    ProjectRegistry reg;
    address admin = makeAddr("admin");
    address registrar = makeAddr("registrar");

    function setUp() public {
        reg = new ProjectRegistry(admin);
        bytes32 role = reg.REGISTRAR_ROLE();
        vm.prank(admin);
        reg.grantRole(role, registrar);
    }

    function test_registerOnceOnly() public {
        vm.startPrank(registrar);
        reg.register(bytes32("P-000"), keccak256("m"), "u");
        vm.expectRevert(ProjectRegistry.AlreadyRegistered.selector);
        reg.register(bytes32("P-000"), keccak256("m"), "u");
        vm.stopPrank();
        assertEq(reg.count(), 1);
    }

    function test_statusHistoryPreservesEveryState() public {
        vm.startPrank(registrar);
        reg.register(bytes32("P-000"), keccak256("m"), "u");
        reg.setStatus(bytes32("P-000"), ProjectRegistry.Status.Building);
        reg.setStatus(bytes32("P-000"), ProjectRegistry.Status.Live);
        reg.setStatus(bytes32("P-000"), ProjectRegistry.Status.Sunset);
        vm.stopPrank();
        ProjectRegistry.Status[] memory h = reg.statusHistory(bytes32("P-000"));
        assertEq(h.length, 4); // Research, Building, Live, Sunset — nothing erased
        assertEq(uint8(h[0]), uint8(ProjectRegistry.Status.Research));
        assertEq(uint8(h[3]), uint8(ProjectRegistry.Status.Sunset));
    }

    function test_policyRequiresAdminAndValidBps() public {
        vm.prank(registrar);
        reg.register(bytes32("P-000"), keccak256("m"), "u");
        vm.prank(registrar);
        vm.expectRevert();
        reg.setPolicy(bytes32("P-000"), 500, true);
        vm.startPrank(admin);
        vm.expectRevert(ProjectRegistry.BpsOutOfRange.selector);
        reg.setPolicy(bytes32("P-000"), 10_001, true);
        reg.setPolicy(bytes32("P-000"), 500, true);
        vm.stopPrank();
        assertEq(reg.project(bytes32("P-000")).stateZeroAllocationBps, 500);
        assertTrue(reg.project(bytes32("P-000")).policyApproved);
    }

    function test_unknownProjectReverts() public {
        vm.expectRevert(ProjectRegistry.UnknownProject.selector);
        reg.project(bytes32("nope"));
    }
}
