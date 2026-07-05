import React from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
    variant?: "danger" | "warning";
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    isLoading = false,
    variant = "danger",
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="sm"
            showCloseButton={false}
        >
            <div className="flex flex-col items-center text-center gap-4 py-2">
                <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center ${
                        variant === "danger" ? "bg-red-50" : "bg-gray-100"
                    }`}
                >
                    <AlertTriangle
                        size={28}
                        className={
                            variant === "danger"
                                ? "text-red-500"
                                : "text-gray-600"
                        }
                    />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500">{message}</p>
                </div>
                <div className="flex gap-3 w-full">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={variant === "danger" ? "danger" : "primary"}
                        className="flex-1"
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;
